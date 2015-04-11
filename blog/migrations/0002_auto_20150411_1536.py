# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='body_en',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='post',
            name='body_fi',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='post',
            name='title_en',
            field=models.CharField(null=True, max_length=255),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='post',
            name='title_fi',
            field=models.CharField(null=True, max_length=255),
            preserve_default=True,
        ),
    ]
