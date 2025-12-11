# backend/marketinghack/app/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from .tasks import send_order_confirmation_sms

# The @receiver decorator connects the function (the Listener) 
# to a specific Signal (post_save) from a specific Sender (Order model).
@receiver(post_save, sender=Order)
def order_saved_listener(sender, instance, created, **kwargs):
    """
    Listener: Triggers after an Order object is saved to the database.
    Action: If a new order is created, queue an SMS confirmation job.
    """
    
    # The 'created' argument is True if the object was just created
    # and False if it was updated.
    if created:
        print(f"Signal caught: New Order created with ID {instance.id}. Queuing confirmation SMS.")
        
        # We no longer call send_sms_task directly here,
        # we now just call the wrapper task.
        send_order_confirmation_sms.delay(instance.id)