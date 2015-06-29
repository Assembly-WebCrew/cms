from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from .models import BlogListPlugin, PostListPlugin, BlogDetailPlugin, PostDetailPlugin
from django.utils.translation import ugettext as _


class BlogListCMSPlugin(CMSPluginBase):
    name = _('Blog List Plugin')
    module = _('Blog')
    render_template = 'blog/blog_list.html'
    model = BlogListPlugin


class LinkListCMSPlugin(CMSPluginBase):
    name = _('Blog Link List Plugin')
    module = _('Blog')
    render_template = 'blog/blog_post_link_list.html'
    model = PostListPlugin

    def render(self, context, instance, placeholder):
        context['blog_id'] = instance.blog_id
        context['post_list'] = instance.posts
        return context

plugin_pool.register_plugin(LinkListCMSPlugin)


class SingleFeaturedPostCMSPlugin(CMSPluginBase):
    name = _('Single featured post')
    module = _('Blog')
    render_template = 'blog/blog_post_summary_list.html'
    model = PostListPlugin

    def render(self, context, instance, placeholder):
        context['blog_id'] = instance.blog_id
        context['post_list'] = instance.posts
        return context


class SummaryListCMSPlugin(CMSPluginBase):
    name = _('Blog Summary List Plugin')
    module = _('Blog')
    render_template = 'blog/blog_post_summary_list.html'
    model = PostListPlugin

    def render(self, context, instance, placeholder):
        context['blog_id'] = instance.blog_id
        context['post_list'] = instance.posts
        return context

plugin_pool.register_plugin(SummaryListCMSPlugin)

class PostDetailCMSPlugin(CMSPluginBase):
    name = _('Blog Post Detail Plugin')
    module = _('Blog')
    render_template = 'blog/blog_post_detail.html'
    model = PostDetailPlugin

    def render(self, context, instance, placeholder):
        context['blog_id'] = instance.blog_id
        context['post'] = instance.post
        return context

plugin_pool.register_plugin(PostDetailCMSPlugin)