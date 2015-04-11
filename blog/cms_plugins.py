from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from .models import BlogListPlugin, PostListPlugin, BlogDetailPlugin, PostDetailPlugin
from django.utils.translation import ugettext as _


class PostListCMSPlugin(CMSPluginBase):
    name = 'Blog post list'
    render_template = "blog/post_list.html"
    model = PostListPlugin
    allow_children = True
    child_classes = ['PostDetailCMSPlugin']

    def render(self, context, instance, placeholder):
        context['blog_id'] = instance.blog_id
        context['posts'] = instance.posts
        return context

plugin_pool.register_plugin(PostListCMSPlugin)

class PostDetailCMSPlugin(CMSPluginBase):
    name = 'Blog post detail'
    render_template = "blog/blog_detail.html"
    model = PostDetailPlugin
    parent_classes = ['PostListCMSPlugin']

    def render(self, context, instance, placeholder):
        context['blog_id'] = instance.blog_id
        context['post'] = instance.post
        return context

plugin_pool.register_plugin(PostDetailCMSPlugin)