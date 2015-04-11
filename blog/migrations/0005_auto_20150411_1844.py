# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_post_cover_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='permission',
            name='can_create',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='permission',
            name='can_delete',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='permission',
            name='can_edit',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
