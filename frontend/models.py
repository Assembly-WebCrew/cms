from django.db import models
from cms.models.pluginmodel import CMSPlugin

class Countdown(CMSPlugin):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

class ScheduleView(CMSPlugin):
    json_url = models.CharField(max_length=255)

class StreamView(CMSPlugin):
    api_url = models.CharField(max_length=255)