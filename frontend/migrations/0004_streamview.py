# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0013_urlconfrevision'),
        ('frontend', '0003_scheduleview'),
    ]

    operations = [
        migrations.CreateModel(
            name='StreamView',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(auto_created=True, serialize=False, to='cms.CMSPlugin', primary_key=True, parent_link=True)),
                ('api_url', models.CharField(max_length=255)),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
    ]
