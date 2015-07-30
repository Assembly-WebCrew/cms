from threading import local


class SiteId(object):

    def __init__(self):
        self._site_thread_info = local()
        self._site_thread_info.SITE_ID = 1

    def __int__(self):
        return self._site_thread_info.SITE_ID

    def __hash__(self):
        return self._site_thread_info.SITE_ID

    def __str__(self):
        return str(self._site_thread_info.SITE_ID)

    def _set(self, new_id):
        self._site_thread_info.SITE_ID = new_id
