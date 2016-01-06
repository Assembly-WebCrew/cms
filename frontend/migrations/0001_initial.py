# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.contrib.sites.managers


class Migration(migrations.Migration):

    dependencies = [
        ('sites', '0001_initial'),
        ('cms', '0013_urlconfrevision'),
    ]

    operations = [
        migrations.CreateModel(
            name='Countdown',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(parent_link=True, primary_key=True, to='cms.CMSPlugin', serialize=False, auto_created=True)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('site', models.ForeignKey(to='sites.Site')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
            managers=[
                ('on_site', django.contrib.sites.managers.CurrentSiteManager()),
            ],
        ),
    ]
