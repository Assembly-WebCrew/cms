from __future__ import absolute_import
from celery import shared_task
import tweepy

@shared_task
def fetch_schedule(bind=True):
    auth = tweepy.OAuthHandler("D42C4ev1mfGoKWHWiuQng4Uha", "OOL8tnnyQiMhNowPJ9Xhp1z85jvZd2isW6pDgdxZxgLbMwRzIb")
    auth.set_access_token("250732849-6FulPWJtvIj28t5SoJiVAICw2pY4x1DjQmYeyubh", "aD4Z3DXvPDXsDzQlyEj719leJQFS3wUtCbdWqcw8tWkVO")

    api = tweepy.API(auth)

    api.home_timeline()
