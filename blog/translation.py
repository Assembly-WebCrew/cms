from modeltranslation.translator import translator, TranslationOptions
from blog.models import Post


class PostTranslationOptions(TranslationOptions):
    fields = ('title', 'body',)

translator.register(Post, PostTranslationOptions)
