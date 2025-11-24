import './Shop.css'

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartProps = {
  cart: CartItem[];
  onCheckout: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
};

const Cart = ({ cart, onCheckout, onUpdateQuantity, onRemoveItem }: CartProps) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <p className="empty-cart-subtext">Start shopping to add items!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">KSH {item.price.toLocaleString()}</p>
                </div>
                <div className="cart-item-controls">
                  <button
                    className="qty-btn minus"
                    onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn plus"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  KSH {(item.price * item.quantity).toLocaleString()}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>KSH {total.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Items:</span>
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
          </div>
          <div className="cart-total">Total: KSH {total.toLocaleString()}</div>
          <button className="checkout-btn" onClick={onCheckout}>💳 Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;
