from django.db import models
from cms.models.pluginmodel import CMSPlugin
from django.contrib.sites.models import Site
from django.contrib.sites.managers import CurrentSiteManager

class Countdown(CMSPlugin):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    site = models.ForeignKey(Site)
    on_site = CurrentSiteManager()
