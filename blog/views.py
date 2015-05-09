from blog.models import Blog, Post
from django.views.generic import ListView, DetailView


class BlogListView(ListView):
    model = Blog
    context_object_name = "blog_list"
    template_name = "blog/blog_list.html"

class BlogDetailView(DetailView):
    model = Blog
    context_object_name = "blog"
    template_name = "blog/blog_detail.html"

class BlogPostLinkListView(ListView):
    model = Post
    context_object_name = "post_list"
    template_name = "blog/blog_post_link_list.html"

    def get_context_data(self, **kwargs):
        context = super(BlogPostLinkListView, self).get_context_data(**kwargs)
        context["blog_id"] = self.kwargs["blog_id"]
        return context

class BlogPostSummaryListView(ListView):
    model = Post
    context_object_name = "post_summary_list"
    template_name = "blog/blog_post_summary_list.html"

    def get_context_data(self, **kwargs):
        context = super(BlogPostSummaryListView, self).get_context_data(**kwargs)
        context["blog_id"] = self.kwargs["blog_id"]
        return context

class PostDetailView(DetailView):
    model = Post
    context_object_name = "post"
    template_name = "blog/blog_post_detail.html"

    def get_context_data(self, **kwargs):
        context = super(PostDetailView, self).get_context_data(**kwargs)
        context["blog_id"] = self.kwargs["blog_id"]
        return context