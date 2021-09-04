import os
from pathlib import Path

from django.core.management import BaseCommand
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow


class Command(BaseCommand):
    SCRIPT_PATH = Path(__file__).resolve().parent
    CREDENTIALS_FILE_NAME = 'credentials.json'
    TOKEN_FILE_NAME = 'token.json'
    # If modifying these scopes, delete the file token.json
    SCOPES = ['https://www.googleapis.com/auth/gmail.send']

    def handle(self, *args, **options):
        credentials = None

        if os.path.exists(self.SCRIPT_PATH / self.TOKEN_FILE_NAME):
            credentials = Credentials.from_authorized_user_file(self.TOKEN_FILE_NAME)
        if not credentials or not credentials.valid:
            # print('Credentials problem')
            # if credentials and credentials.expired and credentials.refresh_token:
            #     print('Need to refresh token')
            # else:
            flow = InstalledAppFlow.from_client_secrets_file(str(self.SCRIPT_PATH / self.CREDENTIALS_FILE_NAME),
                                                             self.SCOPES)
            credentials = flow.run_local_server(port=3000)

            with open(self.SCRIPT_PATH / self.TOKEN_FILE_NAME, 'w') as token:
                token.write(credentials.to_json())
