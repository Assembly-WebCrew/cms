from modeltranslation.translator import translator, TranslationOptions
from blog.models import Post, Blog


class PostTranslationOptions(TranslationOptions):
    fields = ('title', 'body', )


class BlogTranslationOptions(TranslationOptions):
    fields = ('title', )

translator.register(Post, PostTranslationOptions)
translator.register(Blog, BlogTranslationOptions)
