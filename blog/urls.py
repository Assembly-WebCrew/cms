from blog.views import BlogListView, BlogDetailView, PostListView, PostDetailView
from django.conf.urls import url

urlpatterns = [
    url(r'^$', BlogListView.as_view(), name='blog-list'),
    url(r'^(?P<pk>[0-9]+)/$', BlogDetailView.as_view(), name='blog-detail'),
    url(r'^(?P<blog_id>[0-9]+)/posts/$', PostListView.as_view(), name='post-list'),
    url(r'^(?P<blog_id>[0-9]+)/posts/(?P<pk>[0-9]+)/$', PostDetailView.as_view(), name='post-detail')
]