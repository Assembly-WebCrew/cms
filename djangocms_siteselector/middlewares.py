from django.conf import settings
from django.contrib.sites.models import Site
from .models import SiteInstance


class SiteSelectorMiddleware(object):
    """
    Middleware for changing language
    """

    def process_request(self, request):
        """
        TODO
        :param request: django request
        :return: TODO
        """

        using_default = False
        slug = request.path.split('/')[1]

        if slug == 'media' or slug == 'static':
            return

        try:
            site_instance = SiteInstance.objects.get(slug=slug)
        except SiteInstance.DoesNotExist:
            try:
                using_default = True
                site_instance = SiteInstance.objects.get(default=True)
            except SiteInstance.DoesNotExist:
                site_instance = None

        if site_instance is not None:
            settings.SITE_ID = site_instance.site.id
            if not using_default:
                request.path = request.path.replace(slug + '/', '')
                request.path_info = request.path_info.replace(slug + '/', '')
        else:
            settings.SITE_ID = 1
