# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0012_auto_20150523_1845'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='teaser_en',
            field=models.CharField(null=True, max_length=140),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='post',
            name='teaser_fi',
            field=models.CharField(null=True, max_length=140),
            preserve_default=True,
        ),
    ]
