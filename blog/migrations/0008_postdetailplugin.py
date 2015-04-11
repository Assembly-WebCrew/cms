# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_auto_20140926_2347'),
        ('blog', '0007_blogdetailplugin'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostDetailPlugin',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(auto_created=True, primary_key=True, to='cms.CMSPlugin', serialize=False, parent_link=True)),
                ('post', models.ForeignKey(to='blog.Post')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
    ]
