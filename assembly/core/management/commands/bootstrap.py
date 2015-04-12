from django.core import management
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    args = '<path to data file>'
    help = 'Bootstrap the database with given fixture or initial_data fixture'

    def handle(self, *args, **options):
        if args and isinstance(args[0], str):
            file = args[0]
        else:
            file = 'assembly/core/fixtures/initial_data.json'
        management.call_command('migrate')
        management.call_command('loaddata', file, verbosity=0)
        print('CMS dataset initialized.')