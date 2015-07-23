from __future__ import absolute_import

import os

from celery import Celery

from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assembly.settings.local')

app = Celery('assembly')
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

import requests
import json

@app.task
def fetch_schedule():
    r = requests.get('http://schedule.assembly.org/asms15/schedules/events.json')
    if (r.status_code == 200):
        data = r.json()
        with open('./media/uploads/schedule/events.json', 'w') as f:
            json.dump(data, f)