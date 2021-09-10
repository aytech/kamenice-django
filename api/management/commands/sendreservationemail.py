import base64
import logging
import os
import re
from email.header import Header
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from django.core.exceptions import ObjectDoesNotExist
from django.core.management import BaseCommand, CommandError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from api.models.Reservation import Reservation
from django.utils.translation import gettext_lazy as _


class Command(BaseCommand):
    help = 'Send email to specified users to confirm reservation and prices'

    SCRIPT_PATH = Path(__file__).resolve().parent
    CREDENTIALS_FILE_NAME = 'credentials.json'
    TOKEN_FILE_NAME = 'token.json'
    CONFIRMATION_EMAIL_FILE_NAME = 'confirmation_email.html'
    LOGO_FILE_NAME = 'logo.png'
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

    def __init__(self):
        super().__init__()
        self.logger = logging.getLogger("kamenice")

    @staticmethod
    def get_localized_date(date):
        months = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října',
                  'listopadu', 'prosince']
        return '{} {} {}'.format(date.day, months[date.month - 1], date.year)

    @staticmethod
    def get_reservation_type(type_key):
        types = {
            'ACCOMMODATED': _('Currently accommodated'),
            'BINDING': _('Binding reservation'),
            'INHABITED': _('Occupied term'),
            'NONBINDING': _('Non-binding reservation'),
        }
        return str(types[type_key])

    @staticmethod
    def get_reservation_meal(meal):
        meals = {
            'BREAKFAST': _('Breakfast included'),
            'HALFBOARD': _('Half board'),
            'NOMEAL': _('Food not included'),
        }
        return str(meals[meal])

    def send_confirmation_email(self, reservation):
        env = os.environ['DJANGO_SETTINGS_MODULE']

        if env == 'kamenice_django.settings.development':
            from kamenice_django.settings import development as settings
        else:
            from kamenice_django.settings import production as settings

        credentials = None

        if os.path.exists(self.SCRIPT_PATH / self.TOKEN_FILE_NAME):
            credentials = Credentials.from_authorized_user_file(str(self.SCRIPT_PATH / self.TOKEN_FILE_NAME))

        if not credentials or not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
            else:
                self.logger.error('Looks like token.json file was not found, please re-authorize')
                raise CommandError('Client is not authorized')

        service = build('gmail', 'v1', credentials=credentials)

        message = MIMEMultipart()
        message['to'] = ','.join(settings.TO_EMAIL_RECIPIENTS)
        message['bcc'] = ','.join(settings.BCC_EMAIL_RECIPIENTS)
        message['subject'] = 'Mlýn Kamenice - potvrzení rezervace'
        message.add_header('reply-to', settings.REPLY_TO_EMAIL_ADDRESS)

        with open(self.SCRIPT_PATH / self.CONFIRMATION_EMAIL_FILE_NAME, 'r', encoding='utf-8') as message_reader:
            message_body = message_reader.read()
            message_body = re.sub(r'#reservation_date_from', Command.get_localized_date(reservation.from_date),
                                  message_body)
            message_body = re.sub(r'#reservation_date_to', Command.get_localized_date(reservation.to_date),
                                  message_body)
            message_body = re.sub(r'#number_of_guests', str(1 + reservation.roommates.count()), message_body)
            message_body = re.sub(r'#reservation_type', Command.get_reservation_type(reservation.type), message_body)
            message_body = re.sub(r'#reservation_meal', Command.get_reservation_meal(reservation.meal), message_body)
            message_body = re.sub(r'#reservation_price', str(reservation.price_total), message_body)
            message_body = re.sub(r'#guests_url', '{}/rezervace/{}/hoste'.format(settings.APP_URL, reservation.hash),
                                  message_body)

        message.attach(MIMEText(message_body, 'html'))

        with open(self.SCRIPT_PATH / self.LOGO_FILE_NAME, 'rb') as logo_reader:
            logo = MIMEImage(logo_reader.read())

        logo.add_header('Content-ID', '<logo>')
        message.attach(logo)

        try:
            sent_message = (service
                            .users()
                            .messages()
                            .send(userId='me',
                                  body={
                                      'raw': base64.urlsafe_b64encode(
                                          message.as_string().encode('utf-8')).decode()})).execute()
            reservation.confirmation_sent = True
            reservation.save()
            self.logger.info('Reservation email successfully sent with ID {}'.format(sent_message['id']))
        except HttpError as reason:
            self.logger.error('Error sending reservation email with error: {}'.format(reason))

    def handle(self, *args, **options):
        try:
            reservation = Reservation.objects.filter(confirmation_sent=False, deleted=False)
            if reservation.count() > 0:
                self.send_confirmation_email(reservation[0])
        except ObjectDoesNotExist:
            pass
