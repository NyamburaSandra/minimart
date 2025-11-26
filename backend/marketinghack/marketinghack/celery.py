# backend/marketinghack/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketinghack.settings')

app = Celery('marketinghack')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
