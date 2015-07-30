from django.contrib import admin
from django.contrib.sites.models import Site
from django.contrib.sites.admin import SiteAdmin
from .models import SiteInstance

# Unregister native admin
admin.site.unregister(Site)


# Create inline instance definition
class SiteInstanceInline(admin.StackedInline):
    model = SiteInstance
    can_delete = False
    verbose_name_plural = 'site_instance'


@admin.register(Site)
class SiteAdmin(SiteAdmin):
    list_display = ('domain', 'slug', 'name', 'is_default',)
    inlines = (SiteInstanceInline,)

    def slug(self, model):
        return model.siteinstance.slug

    def is_default(self, model):
        return model.siteinstance.default
