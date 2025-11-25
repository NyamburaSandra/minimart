from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Business(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    business = models.ForeignKey(Business, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Campaign(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    content = models.TextField()
    scheduled_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Customer(models.Model):
    phone = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.phone

class Order(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    items = models.JSONField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class SMSMessage(models.Model):
    provider_id = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=20)
    direction = models.CharField(max_length=4, choices=(('in','in'),('out','out')))
    text = models.TextField()
    status = models.CharField(max_length=50, default='queued')
    created_at = models.DateTimeField(auto_now_add=True)