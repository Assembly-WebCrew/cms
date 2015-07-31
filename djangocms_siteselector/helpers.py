import inspect
from django.conf import settings


def get_current_site():
    from .models import SiteInstance
    try:
        return SiteInstance.objects.get(site__id=settings.SITE_ID)
    except SiteInstance.DoesNotExist:
        return None


def get_caller():
    stack = inspect.stack()
    frame = stack[2][0]
    return frame.f_locals.get('self', None)
