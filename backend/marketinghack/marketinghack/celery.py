import os
from celery import Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketing_hack.settings')
app = Celery('marketing_hack')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()