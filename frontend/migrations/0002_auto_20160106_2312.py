# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='countdown',
            managers=[
            ],
        ),
        migrations.RemoveField(
            model_name='countdown',
            name='site',
        ),
    ]
