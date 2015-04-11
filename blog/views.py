from blog.models import Blog, Post
from django.http import JsonResponse
from django.views.generic import ListView, DetailView


class BlogListView(ListView):
    model = Blog
    context_object_name = "blog_list"
    template_name = "blog/blog_list.html"

class BlogDetailView(DetailView):
    model = Blog
    context_object_name = "blog"
    template_name = "blog/blog_detail.html"

class PostListView(ListView):
    model = Post
    context_object_name = "post_list"
    template_name = "blog/post_list.html"

    def get_context_data(self, **kwargs):
        context = super(PostListView, self).get_context_data(**kwargs)
        context["blog_id"] = self.kwargs["blog_id"]
        return context

class PostDetailView(DetailView):
    model = Post
    context_object_name = "post"
    template_name = "blog/post_detail.html"

    def get_context_data(self, **kwargs):
        context = super(PostDetailView, self).get_context_data(**kwargs)
        context["blog_id"] = self.kwargs["blog_id"]
        return context