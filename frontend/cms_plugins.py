from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from cms.models.pluginmodel import CMSPlugin
from django.utils.translation import ugettext_lazy as _

# Countdown Plugin
###

from .models import Countdown

class CountdownPlugin(CMSPluginBase):
    name = _("Countdown")
    module = _("Assembly")
    model = Countdown
    render_template = "countdown/countdown.html"
    cache = False
    text_enabled = True

    def render(self, context, instance, placeholder):
        context['instance'] = instance
        return context

plugin_pool.register_plugin(CountdownPlugin)

# Schedule View Plugin
###

from .models import ScheduleView

class ScheduleViewPlugin(CMSPluginBase):
    name = _("Schedule")
    module = _("Assembly")
    model = ScheduleView
    render_template = "schedule/schedule.html"
    cache = False
    text_enabled = True

    def render(self, context, instance, placeholder):
        context['instance'] = instance
        return context

plugin_pool.register_plugin(ScheduleViewPlugin)

# Stream View Plugin
###

from .models import StreamView

class StreamViewPlugin(CMSPluginBase):
    name = _("Streams")
    module = _("Assembly")
    model = StreamView
    render_template = "streams/streams.html"
    cache = False
    text_enabled = True

    def render(self, context, instance, placeholder):
        context['instance'] = instance
        return context

plugin_pool.register_plugin(StreamViewPlugin)