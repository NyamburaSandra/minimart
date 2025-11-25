### file: backend/app/tasks.py
from celery import shared_task
from .models import SMSMessage, Order
from .services.africastalking_adapter import AfricaTalkingAdapter

@shared_task(bind=True, max_retries=3)
def send_sms_task(self, sms_id):
    sms = SMSMessage.objects.get(pk=sms_id)
    adapter = AfricaTalkingAdapter()
    resp = adapter.send_sms([sms.phone], sms.text)
    # basic status handling
    sms.status = 'sent'
    sms.provider_id = resp
    sms.save()

@shared_task
def send_order_confirmation_sms(order_id):
    order = Order.objects.get(pk=order_id)
    message = f"Order #{order.id} confirmed. Total: {order.total_amount}"
    sms = SMSMessage.objects.create(phone=order.customer.phone, text=message, direction='out')
    send_sms_task.delay(sms.id)
