from django import template
from ..models import SiteInstance

register = template.Library()


@register.inclusion_tag('djangocms_siteselector/sitepicker.html')
def available_sites():
    sites = SiteInstance.objects.all()
    return {'sites': sites}
