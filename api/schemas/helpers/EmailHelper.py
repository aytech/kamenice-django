import base64
import os

from sendgrid import SendGridAPIClient, Mail, Attachment, FileContent, FileType, FileName, Disposition, ContentId

from api.constants import RESERVATION_TYPE_INQUIRY, RESERVATION_TYPE_NONBINDING, ENVIRON_EMAIL_CONFIRMATION_TEMPLATE, \
    ENVIRON_EMAIL_INQUIRY_TEMPLATE, ENVIRON_EMAIL_API_KEY, MUNICIPALITY_FEE, MEAL_CHOICE_HALFBOARD, \
    MEAL_PRICE_HALFBOARD, MEAL_PRICE_BREAKFAST, MEAL_CHOICE_BREAKFAST
from api.schemas.helpers.DateHelper import DateHelper
from django.utils.translation import gettext_lazy as _

from kamenice_django.settings.base import MEDIA_ROOT


class EmailHelper:

    def __init__(self, reservation, data):
        env = os.environ['DJANGO_SETTINGS_MODULE']
        if env == 'kamenice_django.settings.development':
            from kamenice_django.settings import development as settings
        else:
            from kamenice_django.settings import production as settings
        self.settings = settings
        self.reservation = reservation
        self.data = data
        if reservation.type == RESERVATION_TYPE_INQUIRY:
            self.template_id = os.environ[ENVIRON_EMAIL_INQUIRY_TEMPLATE]
        elif reservation.type == RESERVATION_TYPE_NONBINDING:
            self.template_id = os.environ[ENVIRON_EMAIL_CONFIRMATION_TEMPLATE]
        self.api_key = os.environ[ENVIRON_EMAIL_API_KEY]

    def add_reservation_message_body(self, mail):
        if self.reservation.type == RESERVATION_TYPE_INQUIRY:
            return None
        if self.reservation.type == RESERVATION_TYPE_NONBINDING:
            mail.dynamic_template_data = {
                'from': DateHelper.get_formatted_date(self.reservation.from_date),
                'guests': 1 + self.reservation.roommates.count(),
                'meal': self.reservation.read_meal(self.reservation.meal),
                'note': self.data.note,
                'price': str(self.reservation.price_total),
                'to': DateHelper.get_formatted_date(self.reservation.to_date),
                'type': self.reservation.read_type(self.reservation.type),
                'url': '{}/rezervace/{}/hoste'.format(self.settings.APP_URL, self.reservation.hash)
            }

    def inquiry_options(self):
        options = []
        for price in self.reservation.price_set.all():
            options.append({
                'description': '{}.'.format(price.suite.title),
                'price': str(price.total)
            })
        return options

    def meal_description(self):
        if self.reservation.meal == MEAL_CHOICE_HALFBOARD:
            return str(_('Half board'))
        elif self.reservation.meal == MEAL_CHOICE_BREAKFAST:
            return str(_('Breakfast'))
        return None

    def meal_price(self):
        if self.reservation.meal == MEAL_CHOICE_HALFBOARD:
            return MEAL_PRICE_HALFBOARD
        elif self.reservation.meal == MEAL_CHOICE_BREAKFAST:
            return MEAL_PRICE_BREAKFAST
        return None

    def send_mail(self):
        # https://github.com/sendgrid/sendgrid-python/blob/main/use_cases/attachment.md
        mail = Mail(
            from_email=self.settings.FROM_EMAIL_ADDRESS,
            to_emails=','.join([self.reservation.guest.email]))
        if self.reservation.type == RESERVATION_TYPE_NONBINDING:
            mail.dynamic_template_data = {
                'from': DateHelper.get_formatted_date(self.reservation.from_date),
                'guests': 1 + self.reservation.roommates.count(),
                'meal': self.reservation.read_meal(self.reservation.meal),
                'note': self.data.note,
                'price': str(self.reservation.price_total),
                'to': DateHelper.get_formatted_date(self.reservation.to_date),
                'type': self.reservation.read_type(self.reservation.type),
                'url': '{}/rezervace/{}/hoste'.format(self.settings.APP_URL, self.reservation.hash)
            }
        if self.reservation.type == RESERVATION_TYPE_INQUIRY:
            data = {
                'municipality_fee': MUNICIPALITY_FEE,
                'options': self.inquiry_options(),
            }
            meal_description = self.meal_description()
            meal_price = self.meal_price()
            if meal_description is not None:
                data['meal_type'] = meal_description
            if meal_price is not None:
                data['price_meal'] = meal_price
            mail.dynamic_template_data = data
            # Attach terms
            file_path = os.path.join(MEDIA_ROOT, 'smluvni_podminky.pdf')
            with open(file_path, 'rb') as f:
                attachment_data = f.read()
                f.close()
            encoded = base64.b64encode(attachment_data).decode()
            attachment = Attachment()
            attachment.file_content = FileContent(encoded)
            attachment.file_type = FileType('application/pdf')
            attachment.file_name = FileName('Všeobecné smluvní podmínky penzion Mlýn Kamenice.pdf')
            attachment.disposition = Disposition('attachment')
            attachment.content_id = ContentId('Example Content ID')
            mail.attachment = attachment
        mail.template_id = self.template_id
        SendGridAPIClient(os.environ[ENVIRON_EMAIL_API_KEY]).send(mail)
