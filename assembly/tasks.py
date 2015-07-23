import requests
import json
from djcelery import celery

@celery.task
def fetch_schedule():
    r = requests.get('http://schedule.assembly.org/asms15/schedules/events.json')
    if (r.status_code == 200):
        data = r.json()
        with open('./media/uploads/schedule/events.json', 'w') as f:
            json.dump(data, f)