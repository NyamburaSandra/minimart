### file: backend/app/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Business, Product, Campaign, Customer, Order, SMSMessage
from .serializers import ProductSerializer, BusinessSerializer, CampaignSerializer, CustomerSerializer, OrderSerializer, SMSMessageSerializer
from .services.ussd_engine import handle_ussd
from .tasks import send_order_confirmation_sms

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer

class SMSInboundViewSet(viewsets.ModelViewSet):
    queryset = SMSMessage.objects.all()
    serializer_class = SMSMessageSerializer

@method_decorator(csrf_exempt, name='dispatch')
@api_view(['POST'])
@permission_classes([])
def ussd_webhook(request):
    # Example provider fields: sessionId, phoneNumber, text
    session_id = request.data.get('sessionId') or request.data.get('session_id')
    phone = request.data.get('phoneNumber') or request.data.get('phone')
    text = request.data.get('text') or request.data.get('input') or ''
    response_text = handle_ussd(session_id, phone, text)
    # Return plain text according to many USSD providers.
    return Response(response_text, content_type='text/plain')

@method_decorator(csrf_exempt, name='dispatch')
@api_view(['POST'])
@permission_classes([])
def sms_inbound_webhook(request):
    # Provider will POST incoming SMS to this endpoint.
    phone = request.data.get('from') or request.data.get('phone')
    text = request.data.get('text')
    provider_id = request.data.get('id')
    sms = SMSMessage.objects.create(provider_id=provider_id, phone=phone, text=text, direction='in', status='received')
    # rudimentary handling: if reply matches order confirmation, etc.
    return Response({'status': 'ok'})

