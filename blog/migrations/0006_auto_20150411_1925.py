# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_auto_20150411_1844'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='title_en',
            field=models.CharField(max_length=255, null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='blog',
            name='title_fi',
            field=models.CharField(max_length=255, null=True),
            preserve_default=True,
        ),
    ]
