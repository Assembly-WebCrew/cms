# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.template.defaultfilters import slugify
from unidecode import unidecode

def gen_slugs(apps, schema_editor):
    Blog = apps.get_model('blog', 'Blog')
    for row in Blog.objects.all():
        suffix = ""
        found = 0
        while True:
            slug_key = "{0}{1}".format(row.title, suffix).strip()
            possible_slug = slugify(unidecode(slug_key)).strip()

            if Blog.objects.filter(slug=possible_slug).count() < 1:
                row.slug = possible_slug
                break
            else:
                found += 1
                suffix = "-{0}".format(found)
        row.save()


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0016_blog_slug'),
    ]

    operations = [
        migrations.RunPython(gen_slugs),
    ]
