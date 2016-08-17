from django.conf.urls import url, include, patterns
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.conf import settings

from filebrowser.sites import site

from cms.sitemaps import CMSSitemap

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^admin/filebrowser/', include(site.urls)),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^filer/', include('filer.urls')),
                       url(r'^schedule/', include('schedule.urls')),
                       url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap',
                           {'sitemaps': {'cmspages': CMSSitemap}}),
                       url(r'^', include('cms.urls')), )

if settings.DEBUG:
    urlpatterns = urlpatterns \
                  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) \
                  + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
