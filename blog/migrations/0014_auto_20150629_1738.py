# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0013_auto_20150523_2011'),
    ]

    operations = [
        migrations.AddField(
            model_name='postlistplugin',
            name='limit',
            field=models.IntegerField(default=4),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='postlistplugin',
            name='offset',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
