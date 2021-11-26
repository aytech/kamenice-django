import os

from django.core.management import BaseCommand
# https://developers.google.com/docs/api/quickstart/python
from googleapiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials

from kamenice_django.settings.base import KEYS_ROOT


class Command(BaseCommand):
    help = 'Help text'

    DOCUMENT_ID = None
    TEMPLATE_DOCUMENT_ID = os.environ.get('GUEST_STATEMENT_TEMPLATE')
    SCOPES = [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive'
    ]

    def handle(self, *args, **options):
        service_account_file = KEYS_ROOT / os.environ.get('G_SERVICE_ACCOUNT')
        credentials = ServiceAccountCredentials.from_json_keyfile_name(service_account_file, scopes=self.SCOPES)

        drive_service = build('drive', 'v3', credentials=credentials)
        docs_service = build('docs', 'v1', credentials=credentials)

        print(drive_service.files().list().execute())
