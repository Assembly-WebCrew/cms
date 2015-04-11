from blog.models import Blog, Post
from blog.serializers.api_serializers import BlogSerializer, PostSerializer
from rest_framework import viewsets


class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer