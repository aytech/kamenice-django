import logging
import os
from datetime import datetime

from django.core.management import BaseCommand
from sendgrid import Mail, SendGridAPIClient

from api.constants import RESERVATION_TYPE_NONBINDING, ENVIRON_EMAIL_EXPIRATION_TEMPLATE, ENVIRON_EMAIL_API_KEY
from api.models.Reservation import Reservation
from api.schemas.helpers.DateHelper import DateHelper


class Command(BaseCommand):
    help = 'Find expired non-binding reservations and send notifications'

    def __init__(self):
        super().__init__()
        self.logger = logging.getLogger('kamenice')

    def handle(self, *args, **options):
        try:
            env = os.environ['DJANGO_SETTINGS_MODULE']

            if env == 'kamenice_django.settings.development':
                from kamenice_django.settings import development as settings
            else:
                from kamenice_django.settings import production as settings

            reservations = Reservation.objects.filter(type=RESERVATION_TYPE_NONBINDING, deleted=False)
            for reservation in reservations.all():
                if reservation.expired is None:
                    continue
                duration = reservation.expired - datetime.now()
                if duration.days < 0:
                    message = Mail(
                        from_email=settings.FROM_EMAIL_ADDRESS,
                        to_emails=','.join(["oyapparov@gmail.com"]))
                    message.dynamic_template_data = {
                        'from': DateHelper.get_formatted_date(reservation.from_date),
                        'name': reservation.guest.name,
                        'surname': reservation.guest.surname,
                        'to': DateHelper.get_formatted_date(reservation.to_date),
                        'url': '{}/rezervace/{}'.format(settings.APP_URL, reservation.id)
                    }
                    message.template_id = os.environ[ENVIRON_EMAIL_EXPIRATION_TEMPLATE]

                    SendGridAPIClient(os.environ[ENVIRON_EMAIL_API_KEY]).send(message)

                    logging.getLogger('kamenice').info('Expiring reservation notification sent to admin')
        except Exception as ex:
            print(ex)
            logging.getLogger('kamenice').error('Could not send expiring reservation notification: {}'.format(ex))
