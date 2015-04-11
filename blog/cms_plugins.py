from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from .models import BlogPlugin
from django.utils.translation import ugettext as _


class CMSBlogListPlugin(CMSPluginBase):
    model = BlogPlugin
    name = _('Blog List')
    render_template = 'blog/list.html'

    def render(self, context, instance, placeholder):
        context.update({
            'blog': instance.blog,
            'object': instance,
            'placeholder': placeholder
        })

        return context

plugin_pool.register_plugin(CMSBlogListPlugin)