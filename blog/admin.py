from django.db.models import Q
from django.contrib import admin
from django.contrib.admin import widgets
from django import forms
from django.contrib import messages
from django.contrib.sites.models import Site
from blog.models import Blog, Post, Permission
from modeltranslation.admin import TranslationAdmin, TranslationStackedInline
import reversion
from ckeditor.widgets import CKEditorWidget


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


class PostInlineForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(PostInlineForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Post
        exclude = ['author', ]
        widgets = {
            'body_en': CKEditorWidget(),
            'body_fi': CKEditorWidget(),
            'featured_until': widgets.AdminSplitDateTime(),
            'public_from': widgets.AdminSplitDateTime()
        }


class PermissionInline(admin.TabularInline):
    model = Permission
    extra = 0


class PostInline(TranslationStackedInline):
    _parent_instance = None
    _current_user = None

    model = Post
    form = PostInlineForm
    exclude = ['author', ]
    extra = 0

    def get_formset(self, *args, **kwargs):
        def formfield_callback(field, **kwargs):
            formfield = field.formfield(**kwargs)
            if field.name == "sites":
                blog_sites = []
                for site in self._parent_instance.sites.all():
                    blog_sites.append(site.id)
                formfield.queryset = Site.objects.filter(pk__in=blog_sites)
            return formfield

        if self._parent_instance is not None:
            kwargs['formfield_callback'] = formfield_callback

        return super(PostInline, self).get_formset(*args, **kwargs)


class BlogAdmin(TranslationAdmin):
    inlines = [
        PermissionInline,
        PostInline
    ]

    class Media:
        js = [
            'blog/collapsed_post_inlines.js',
        ]
        css = {
        }

    def get_queryset(self, request):
        qs = super(BlogAdmin, self).get_queryset(request)
        if request.user.is_superuser:
            return qs

        access_to_blogs = []
        permissions = Permission.objects.filter(
            Q(user=request.user),
            Q(can_edit=True) | Q(can_delete=True) | Q(can_create=True)
        )
        for permission in permissions:
            access_to_blogs.append(permission.blog.id)

        return qs.filter(id__in=access_to_blogs)

    def get_formsets(self, request, obj=None, *args, **kwargs):
        for inline in self.get_inline_instances(request, obj):
            inline._parent_instance = obj
            inline._current_user = request.user
            yield inline.get_formset(request, obj)

    def has_add_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True

        return False

    def save_formset(self, request, form, formset, change):
        if formset.model != Post:
            return super(BlogAdmin, self).save_formset(request, form, formset, change)

        instances = formset.save(commit=False)
        for obj in formset.deleted_objects:
            if request.user.is_superuser:
                obj.delete()
                messages.add_message(request, messages.SUCCESS, 'Post %s has bee deleted' % obj.title)
                continue
            try:
                Permission.objects.get(user=request.user, blog=obj.blog, can_delete=True)
                obj.delete()
                messages.add_message(request, messages.SUCCESS, 'Post %s has bee deleted' % obj.title)
            except Permission.DoesNotExist:
                messages.add_message(request, messages.ERROR, 'You do not have permissions to'
                                                              'delete post %s.' % obj.title)

        for instance in instances:
            if not hasattr(instance, 'author'):
                instance.author = request.user
            instance.save()
        formset.save_m2m()


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
