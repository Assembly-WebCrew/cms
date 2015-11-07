from django.conf.urls import url, include, patterns
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.conf import settings

from filebrowser.sites import site

from cms.sitemaps import CMSSitemap

admin.autodiscover()

urlpatterns = patterns('',
                            url(r'^admin/filebrowser/', include(site.urls)),
                            url(r'^admin/', include(admin.site.urls)),
                            url(r'^blogs/', include('blog.urls')),
                            url(r'^schedule/', include('schedule.urls')),
                            url(r'^blogit/', include('blog.urls')),
                            url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap', {'sitemaps': {'cmspages': CMSSitemap}}),
                            url(r'^', include('cms.urls')),)

if settings.DEBUG:
    urlpatterns = patterns('',
                           url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
                               {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
                           url(r'', include('django.contrib.staticfiles.urls')),) + urlpatterns
