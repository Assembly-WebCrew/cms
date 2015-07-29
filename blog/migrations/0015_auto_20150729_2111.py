# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0014_auto_20150629_1738'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='hidden',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='post',
            name='public_from',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
