from django.db.models import Q
from django.contrib import admin
from django import forms
from blog.models import Blog, Post, Permission
from django.contrib import messages
from modeltranslation.admin import TranslationAdmin, TranslationTabularInline
import reversion


class PostForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(PostForm, self).__init__(*args, **kwargs)

        if not self.current_user.is_superuser:
            access_to_blogs = []
            permissions = Permission.objects.filter(
                Q(user=self.current_user),
                Q(can_edit=True) | Q(can_delete=True)
            )
            for permission in permissions:
                access_to_blogs.append(permission.blog.id)

            self.fields['blog'].queryset = Blog.objects.filter(pk__in=access_to_blogs)

    class Meta:
        model = Post
        exclude = ['author', ]

    def clean(self):
        if not self.current_user.is_superuser:
            cleaned_data = super(PostForm, self).clean()

            if 'blog' in cleaned_data:
                if self.instance.id:
                    try:
                        Permission.objects.get(user=self.current_user, blog=cleaned_data['blog'], can_edit=True)
                    except Permission.DoesNotExist:
                        raise forms.ValidationError("You do not have permission to edit this post.")
                else:
                    try:
                        Permission.objects.get(user=self.current_user, blog=cleaned_data['blog'], can_create=True)
                    except Permission.DoesNotExist:
                        raise forms.ValidationError("You do not have permission to create posts to this blog.")


class PermissionInline(admin.TabularInline):
    model = Permission


class PostInline(TranslationTabularInline):
    model = Post


class BlogAdmin(TranslationAdmin):
    inlines = [
        PermissionInline,
        PostInline
    ]


class PostAdmin(TranslationAdmin):
    actions = ['delete_model']
    list_display = ('title', 'blog')
    exclude = ('author', 'created', )
    list_filter = ('blog',)
    form = PostForm

    def get_actions(self, request):
        actions = super(PostAdmin, self).get_actions(request)
        del actions['delete_selected']
        return actions

    def delete_model(self, request, obj):
        for o in obj.all():
            if request.user.is_superuser:
                o.delete()
                messages.add_message(request, messages.SUCCESS, 'Post %s has bee deleted' % o.title)
                continue
            try:
                Permission.objects.get(user=request.user, blog=o.blog, can_delete=True)
                o.delete()
                messages.add_message(request, messages.SUCCESS, 'Post %s has bee deleted' % o.title)
            except Permission.DoesNotExist:
                messages.add_message(request, messages.ERROR, 'You do not have permissions to'
                                                              'delete post %s.' % o.title)

    delete_model.short_description = 'Delete selected post(s)'

    def get_form(self, request, obj=None, **kwargs):
        form = super(PostAdmin, self).get_form(request, obj, **kwargs)
        form.current_user = request.user
        return form

    def get_queryset(self, request):
        qs = super(PostAdmin, self).get_queryset(request)
        if request.user.is_superuser:
            return qs

        access_to_blogs = []
        permissions = Permission.objects.filter(
            Q(user=request.user),
            Q(can_edit=True) | Q(can_delete=True)
        )
        for permission in permissions:
            access_to_blogs.append(permission.blog.id)

        return qs.filter(blog__in=access_to_blogs)

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True

        if obj:
            try:
                Permission.objects.get(user=request.user, blog=obj.blog, can_delete=True)
            except Permission.DoesNotExist:
                return False

        return True

    def has_add_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True

        try:
            Permission.objects.filter(user=request.user, can_create=True)
            return True
        except Permission.DoesNotExist:
            return False

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True

        if obj:
            try:
                Permission.objects.get(user=request.user, blog=obj.blog, can_edit=True)
            except Permission.DoesNotExist:
                return False

        return True

    def save_model(self, request, obj, form, change):
        if not hasattr(obj, 'author'):
            obj.author = request.user

        obj.save()


class PostReversionModelAdmin(PostAdmin, reversion.VersionAdmin):
    pass


class PermissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'blog', 'can_create', 'can_edit', 'can_delete')

admin.site.register(Blog, BlogAdmin)
admin.site.register(Post, PostReversionModelAdmin)
admin.site.register(Permission, PermissionAdmin)
