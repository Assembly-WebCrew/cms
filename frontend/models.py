from django.db import models
from cms.models.pluginmodel import CMSPlugin

class Countdown(CMSPlugin):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()