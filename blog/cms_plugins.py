from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from .models import BlogListPlugin, PostListPlugin, BlogDetailPlugin
from django.utils.translation import ugettext as _


class CMSBlogListPlugin(CMSPluginBase):
    model = BlogListPlugin
    name = _('Blog List')
    render_template = 'blog/blog_list.html'

    def render(self, context, instance, placeholder):
        context.update({
            'blogs': instance.blogs.all(),
            'object': instance,
            'placeholder': placeholder
        })

        return context

plugin_pool.register_plugin(CMSBlogListPlugin)

class CMSBlogDetailPlugin(CMSPluginBase):
    model = BlogDetailPlugin
    name = _('Blog View')
    render_template = 'blog/blog_detail.html'

    def render(self, context, instance, placeholder):
        context.update({
            'blog': instance.blog,
            'object': instance,
            'placeholder': placeholder
        })

        return context

plugin_pool.register_plugin(CMSBlogDetailPlugin)