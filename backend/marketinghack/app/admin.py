### file: backend/app/admin.py
from django.contrib import admin
from .models import Business, Product, Campaign, Customer, Order, SMSMessage

admin.site.register(Business)
admin.site.register(Product)
admin.site.register(Campaign)
admin.site.register(Customer)
admin.site.register(Order)
admin.site.register(SMSMessage)

