import random
import string
from datetime import datetime

from django.db import models

from django.utils.translation import gettext_lazy as _

from api.models.BaseModel import BaseModel
from api.models.Guest import Guest
from api.models.Suite import Suite


def generate_reservation_hash():
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase) for _ in range(10))


class Reservation(BaseModel):
    year = datetime.now().year
    TYPE_CHOICES = [
        ('ACCOMMODATED', _('Currently accommodated')),
        ('BINDING', _('Binding reservation')),
        ('INHABITED', _('Occupied term')),
        ('NONBINDING', _('Non-binding reservation')),
    ]
    MEAL_CHOICES = [
        ('NOMEAL', _('Meal not included')),
        ('BREAKFAST', _('Breakfast included')),
        ('HALFBOARD', _('Half board'))
    ]
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    deleted = models.BooleanField(default=False)
    from_date = models.DateTimeField(blank=False, null=False, error_messages={
        'invalid': _('Enter valid date for the reservation start date'),
        'null': _('Enter valid date for the reservation start date'),
    })
    guest = models.ForeignKey(
        Guest,
        on_delete=models.CASCADE,
    )
    hash = models.CharField(blank=True, null=True, default=generate_reservation_hash, max_length=10)
    meal = models.CharField(blank=False, max_length=50, null=False, error_messages={
        'invalid_choice': _('Select Meal from the list'),
        'null': _('Select Meal from the list'),
    }, choices=MEAL_CHOICES)
    notes = models.TextField(blank=True, null=True)
    price_accommodation = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Price for accommodation is required field')
    })
    price_extra = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Price for extra bed(s) is required field')
    })
    price_meal = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Price for meal is required field')
    })
    price_municipality = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Municipality fee is required field')
    })
    price_total = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Total price is required field')
    })
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

    def __str__(self):
        return str(self.guest)
