# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import filebrowser.fields


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_auto_20150411_1937'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='cover_image',
            field=filebrowser.fields.FileBrowseField(max_length=200, null=True, blank=True, verbose_name='Image'),
            preserve_default=True,
        ),
    ]
