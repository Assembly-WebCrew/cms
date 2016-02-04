# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0013_urlconfrevision'),
        ('frontend', '0004_streamview'),
    ]

    operations = [
        migrations.CreateModel(
            name='Iframe',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(serialize=False, auto_created=True, parent_link=True, primary_key=True, to='cms.CMSPlugin')),
                ('src', models.CharField(max_length=255)),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
    ]
