# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0011_auto_20150510_1915'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='post',
            options={'ordering': ['-created']},
        ),
        migrations.AddField(
            model_name='post',
            name='teaser',
            field=models.CharField(max_length=140, default=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='post',
            name='featured_until',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
