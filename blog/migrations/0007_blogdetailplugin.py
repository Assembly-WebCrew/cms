# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_auto_20140926_2347'),
        ('blog', '0006_auto_20150411_1925'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlogDetailPlugin',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(serialize=False, parent_link=True, to='cms.CMSPlugin', auto_created=True, primary_key=True)),
                ('blog', models.ForeignKey(to='blog.Blog')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
    ]
