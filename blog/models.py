from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver


class Blog(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    blog = models.ForeignKey(Blog)
    author = models.ForeignKey(User)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Permission(models.Model):
    blog = models.ForeignKey(Blog)
    user = models.ForeignKey(User)
    can_edit = models.BooleanField()
    can_create = models.BooleanField()
    can_delete = models.BooleanField()

    def __str__(self):
        return self.user.username
