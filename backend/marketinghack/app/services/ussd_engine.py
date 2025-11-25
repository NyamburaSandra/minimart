### file: backend/app/services/ussd_engine.py
from django.core.cache import cache
from ..models import Product, Customer, Order

SESSION_TTL = 300  # seconds

MENU_MAIN = "CON Welcome to ShopX\n1. Browse Products\n2. My Orders\n3. Help"

def handle_ussd(session_id, phone, text):
    key = f"ussd:{session_id}"
    state = cache.get(key) or {'step': 0}
    step = state.get('step', 0)

    # Provider may send full text or last input.
    last_input = text.strip() if text is not None else ''

    if step == 0:
        state['step'] = 1
        cache.set(key, state, timeout=SESSION_TTL)
        return MENU_MAIN

    if step == 1:
        # expecting choice
        if last_input == '1':
            products = Product.objects.all()[:5]
            menu = 'CON Products:\n'
            for i, p in enumerate(products, start=1):
                menu += f"{i}. {p.name} - {p.price}\n"
            menu += '\n0. Back'
            state.update({'step': 2, 'products': [p.id for p in products]})
            cache.set(key, state, timeout=SESSION_TTL)
            return menu
        elif last_input == '2':
            # Show orders (simplified)
            cust, _ = Customer.objects.get_or_create(phone=phone)
            orders = Order.objects.filter(customer=cust).order_by('-created_at')[:3]
            if not orders:
                cache.delete(key)
                return 'END You have no orders.'
            menu = 'END Your recent orders:\n'
            for o in orders:
                menu += f"#{o.id} {o.status} {o.total_amount}\n"
            cache.delete(key)
            return menu
        else:
            cache.delete(key)
            return 'END Invalid choice.'

    if step == 2:
        # product selection
        idx = int(last_input) if last_input.isdigit() else -1
        product_ids = state.get('products', [])
        if idx <= 0 or idx > len(product_ids):
            cache.delete(key)
            return 'END Invalid product.'
        pid = product_ids[idx-1]
        product = Product.objects.get(pk=pid)
        state.update({'step': 3, 'selected_product': pid})
        cache.set(key, state, timeout=SESSION_TTL)
        return f'CON {product.name} selected. Enter quantity:'

    if step == 3:
        qty = int(last_input) if last_input.isdigit() else 1
        pid = state.get('selected_product')
        product = Product.objects.get(pk=pid)
        cust, _ = Customer.objects.get_or_create(phone=phone)
        total = product.price * qty
        order = Order.objects.create(business=product.business, customer=cust, items={{str(product.id): qty}}, total_amount=total)
        cache.delete(key)
        # Note: enqueue SMS task to confirm
        return 'END Order received. You will get an SMS confirmation.'

    cache.delete(key)
    return 'END Session ended.'