### file: backend/app/services/africastalking_adapter.py
"""
Simple Africa's Talking adapter using requests. Replace with africastalking SDK if preferred.
"""
import os
import requests
from django.conf import settings

class AfricaTalkingAdapter:
    base = 'https://api.africastalking.com/version1'

    def __init__(self, username=None, api_key=None):
        self.username = username or settings.AFRICASTALKING_USERNAME
        self.api_key = api_key or settings.AFRICASTALKING_API_KEY
        self.headers = {
            'apiKey': self.api_key,
            'Content-Type': 'application/x-www-form-urlencoded'
        }

    def send_sms(self, to, message):
        # to: list of phone numbers
        url = f'{self.base}/messaging'
        payload = {
            'username': self.username,
            'to': ','.join(to) if isinstance(to, list) else to,
            'message': message,
        }
        resp = requests.post(url, data=payload, headers=self.headers)
        return resp.json()

 # USSD is usually handled via provider platform dashboard: they POST to your webhook