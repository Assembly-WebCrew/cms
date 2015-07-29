from __future__ import absolute_import
import requests
import json


from celery import shared_task


@shared_task
def fetch_schedule(bind=True):
    r = requests.get('http://schedule.assembly.org/asms15/schedules/events.json')
    if (r.status_code == 200):
        data = r.json()
        with open('./media/uploads/schedule/events.json', 'w') as f:
            json.dump(data, f)
        return "Fetched schedule"
    else:
        raise r.text
