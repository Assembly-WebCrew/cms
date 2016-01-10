from django.shortcuts import redirect
from django.utils import translation
from django.conf import settings
from django.core.urlresolvers import resolve, Resolver404
from djangocms_siteselector.helpers import get_current_site


class LocaleMiddleware(object):
    """
    Middleware for changing language
    """

    def process_request(self, request):
        """
        If lang is found in Get, changes language to selected one
        :param request: django request
        :return: if lang found, redirects back to view but without get params
        """

        if 'lang' in request.GET:
            # Get selected language and current view
            language = request.GET.get('lang', False)
            current_site = get_current_site()

            # Checks that selected language code is supported
            possible_languages = settings.LANGUAGES
            for possible_lang in possible_languages:
                if language in possible_lang:
                    # Change active language
                    request.session[translation.LANGUAGE_SESSION_KEY] = language
                    request.COOKIES[settings.LANGUAGE_COOKIE_NAME] = language
                    translation.activate(language)
                    break

            try:
                resolve(request.path)
                return redirect('/{0}{1}'.format(current_site.slug, request.path))
            except Resolver404:
                return redirect('/{0}'.format(current_site.slug))
