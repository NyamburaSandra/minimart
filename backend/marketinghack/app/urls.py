### file: backend/app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CampaignViewSet, BusinessViewSet, SMSInboundViewSet, ussd_webhook, sms_inbound_webhook

router = DefaultRouter()
router.register('products', ProductViewSet)
router.register('campaigns', CampaignViewSet)
router.register('businesses', BusinessViewSet)
router.register('messages', SMSInboundViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('webhooks/ussd/', ussd_webhook, name='ussd-webhook'),
    path('webhooks/sms/inbound/', sms_inbound_webhook, name='sms-inbound'),
]