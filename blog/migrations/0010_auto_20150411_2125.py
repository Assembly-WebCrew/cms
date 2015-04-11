# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0009_auto_20150411_2114'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='sites',
            field=models.ManyToManyField(to='sites.Site', blank=True, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='post',
            name='sites',
            field=models.ManyToManyField(to='sites.Site', blank=True, null=True),
            preserve_default=True,
        ),
    ]
