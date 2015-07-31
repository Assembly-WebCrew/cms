from django.template.defaulttags import URLNode
from menus.base import NavigationNode
from .helpers import get_current_site, get_caller

# region URLNode render override
URLNodeBaseFunction = URLNode.render


def urlnode_render_override(cls, context):
    """
    Prefix url with site slug if site.default is not True.
    """
    current_site = get_current_site()
    if current_site is not None and not current_site.default:
            return '/{0}{1}'.format(current_site.slug, URLNodeBaseFunction(cls, context))
    return URLNodeBaseFunction(cls, context)


URLNode.render = urlnode_render_override
# endregion

# region NavigationNode get_absolute_url override
NavigationNodeBaseFunction = NavigationNode.get_absolute_url


def navigationnode_get_absolute_url_override(self):
    """
    Prefix menu url with site slug if site.default is not True.
    """
    from .models import SiteInstance
    from menus.menu_pool import MenuPool

    caller = get_caller()
    called_from_menu_pool = isinstance(caller, MenuPool)
    if not called_from_menu_pool:
        current_site = get_current_site()
        if not current_site.default:
            return '/{0}{1}'.format(current_site.slug, self.url)

    return self.url


NavigationNode.get_absolute_url = navigationnode_get_absolute_url_override
# endregion
