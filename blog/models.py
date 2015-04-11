from django.db import models
from django.contrib.auth.models import User

from filebrowser.fields import FileBrowseField
from cms.models import CMSPlugin


class Blog(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Post(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    cover_image = FileBrowseField("Image", max_length=200, blank=True, null=True)
    blog = models.ForeignKey(Blog)
    author = models.ForeignKey(User)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Permission(models.Model):
    blog = models.ForeignKey(Blog)
    user = models.ForeignKey(User)
    can_edit = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class BlogListPlugin(CMSPlugin):
    blogs = Blog.objects.all()

    def copy_relations(self, old_instance):
        self.blogs = old_instance.blogs


class BlogDetailPlugin(CMSPlugin):
    blog = models.ForeignKey(Blog)

    def copy_relations(self, old_instance):
        self.blog = old_instance.blog


class PostListPlugin(CMSPlugin):
    blog = models.ForeignKey(Blog)

    def posts(self):
        return self.blog.post_set.all()

    def copy_relations(self, old_instance):
        self.blog = old_instance.blog


class PostDetailPlugin(CMSPlugin):
    post = models.ForeignKey(Post)

    def blog_id(self):
        return self.post.blog.id

    def copy_relations(self, old_instance):
        self.post = old_instance.post