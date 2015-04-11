from django.core import management
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Bootstrap the database with given fixture or initial_data fixture'

    def handle(self, *args, **options):
        management.call_command('dumpdata', exclude=['auth', 'filebrowser',])