import random
import string
from datetime import datetime

from django.db import models

from django.utils.translation import gettext_lazy as _

from api.constants import RESERVATION_TYPE_NONBINDING, RESERVATION_TYPE_INHABITED, RESERVATION_TYPE_ACCOMMODATED, \
    RESERVATION_TYPE_BINDING, MEAL_CHOICE_BREAKFAST, MEAL_CHOICE_NOMEAL, MEAL_CHOICE_HALFBOARD, RESERVATION_TYPE_INQUIRY
from api.models.BaseModel import BaseModel
from api.models.Guest import Guest
from api.models.Suite import Suite


def generate_reservation_hash():
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase) for _ in range(10))


class Reservation(BaseModel):
    year = datetime.now().year
    TYPE_CHOICES = [
        (RESERVATION_TYPE_ACCOMMODATED, _('Currently accommodated')),
        (RESERVATION_TYPE_BINDING, _('Binding reservation')),
        (RESERVATION_TYPE_INHABITED, _('Occupied term')),
        (RESERVATION_TYPE_INQUIRY, _('Inquiry')),
        (RESERVATION_TYPE_NONBINDING, _('Non-binding reservation')),
    ]
    MEAL_CHOICES = [
        (MEAL_CHOICE_NOMEAL, _('Meal not included')),
        (MEAL_CHOICE_BREAKFAST, _('Breakfast included')),
        (MEAL_CHOICE_HALFBOARD, _('Half board'))
    ]
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    deleted = models.BooleanField(default=False)
    expired = models.DateTimeField(blank=True, null=True, error_messages={
        'invalid': _('Enter valid date for the expiration'),
    })
    extra_suites = models.ManyToManyField(
        Suite,
        related_name='+'
    )
    from_date = models.DateTimeField(blank=False, null=False, error_messages={
        'invalid': _('Enter valid date for the reservation start date'),
        'null': _('Enter valid date for the reservation start date'),
    })
    guest = models.ForeignKey(
        Guest,
        on_delete=models.DO_NOTHING,
    )
    hash = models.CharField(blank=True, null=True, default=generate_reservation_hash, max_length=10)
    meal = models.CharField(blank=False, max_length=50, null=False, error_messages={
        'invalid_choice': _('Select Meal from the list'),
        'null': _('Select Meal from the list'),
    }, choices=MEAL_CHOICES)
    notes = models.TextField(blank=True, null=True)
    paying_guest = models.ForeignKey(
        Guest,
        blank=True,
        null=True,
        on_delete=models.DO_NOTHING,
        related_name='paying_guest'
    )
    purpose = models.CharField(blank=True, max_length=100, null=True)
    suite = models.ForeignKey(
        Suite,
        on_delete=models.DO_NOTHING
    )
    to_date = models.DateTimeField(blank=False, null=False, error_messages={
        'invalid': _('Enter valid date for the reservation end date'),
        'null': _('Enter valid date for the reservation end date'),
    })
    type = models.CharField(blank=False, max_length=50, null=False, error_messages={
        'invalid_choice': _('Select reservation type from the list'),
        'null': _('Select reservation type from the list'),
    }, choices=TYPE_CHOICES)
    updated = models.DateTimeField(auto_now=True)

    def read_meal(self, meal_key):
        for meal_choice in self.MEAL_CHOICES:
            if meal_choice[0] == meal_key:
                return str(meal_choice[1])
        return meal_key

    def read_type(self, type_key):
        for type_choice in self.TYPE_CHOICES:
            if type_choice[0] == type_key:
                return str(type_choice[1])
        return type_key

    def __str__(self):
        return str(self.guest)
