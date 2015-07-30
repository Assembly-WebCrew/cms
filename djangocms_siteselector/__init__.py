from django.template.defaulttags import URLNode
from django.conf import settings

base = URLNode.render


def override(cls, context):
    """
    Prefix url with site slug if site.default is not True.
    """
    from .models import SiteInstance
    current_site = SiteInstance.objects.get(site__id=settings.SITE_ID)
    if not current_site.default:
        return '/{0}{1}'.format(current_site.slug, base(cls, context))
    else:
        return base(cls, context)


URLNode.render = override
