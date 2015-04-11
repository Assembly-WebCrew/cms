# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_auto_20140926_2347'),
        ('blog', '0002_blogplugin'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlogListPlugin',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(primary_key=True, auto_created=True, parent_link=True, serialize=False, to='cms.CMSPlugin')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
        migrations.CreateModel(
            name='PostListPlugin',
            fields=[
                ('cmsplugin_ptr', models.OneToOneField(primary_key=True, auto_created=True, parent_link=True, serialize=False, to='cms.CMSPlugin')),
                ('blog', models.ForeignKey(to='blog.Blog')),
            ],
            options={
                'abstract': False,
            },
            bases=('cms.cmsplugin',),
        ),
        migrations.RemoveField(
            model_name='blogplugin',
            name='blog',
        ),
        migrations.RemoveField(
            model_name='blogplugin',
            name='cmsplugin_ptr',
        ),
        migrations.DeleteModel(
            name='BlogPlugin',
        ),
        migrations.AddField(
            model_name='post',
            name='body_en',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='post',
            name='body_fi',
            field=models.TextField(null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='post',
            name='title_en',
            field=models.CharField(null=True, max_length=255),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='post',
            name='title_fi',
            field=models.CharField(null=True, max_length=255),
            preserve_default=True,
        ),
    ]
