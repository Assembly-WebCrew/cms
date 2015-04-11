# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_auto_20140926_2347'),
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlogPlugin',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(parent_link=True, to='cms.CMSPlugin', auto_created=True, primary_key=True, serialize=False)),
                ('blog', models.ForeignKey(to='blog.Blog')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
    ]
