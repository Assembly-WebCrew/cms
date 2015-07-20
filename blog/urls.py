from blog.api import BlogViewSet, PostViewSet
from blog.views import BlogListView, BlogDetailView, BlogPostLinkListView, PostDetailView
from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter


urlpatterns = [
    url(r'^$', BlogListView.as_view(), name='blog-list'),
    url(r'^(?P<pk>[0-9]+)/$', BlogDetailView.as_view(), name='blog-detail'),
    url(r'^(?P<blog_id>[0-9]+)/posts/$', BlogPostLinkListView.as_view(), name='post-list'),
    url(r'^(?P<blog_id>[0-9]+)/posts/(?P<pk>[0-9]+)/$', PostDetailView.as_view(), name='post-detail'),
]
