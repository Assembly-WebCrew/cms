from __future__ import absolute_import
from celery import shared_task
from django.conf import settings
import tweepy

auth = tweepy.OAuthHandler(settings.TWITTER.CONSUMER_KEY, settings.TWITTER.CONSUMER_SECRET)
auth.set_access_token(settings.TWITTER.ACCESS_TOKEN, settings.TWITTER.ACCESS_SECRET)

api = tweepy.API(auth)


@shared_task
def fetch_timeline(bind=True):
    api.home_timeline()


@shared_task
def fetch_user_timeline(user_id):
    pass
