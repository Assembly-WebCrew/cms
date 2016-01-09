# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0013_urlconfrevision'),
        ('frontend', '0002_auto_20160106_2312'),
    ]

    operations = [
        migrations.CreateModel(
            name='ScheduleView',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(parent_link=True, serialize=False, to='cms.CMSPlugin', auto_created=True, primary_key=True)),
                ('json_url', models.CharField(max_length=255)),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
    ]
