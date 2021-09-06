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
        ('ACCOMMODATED', 'Aktuálně Ubytování'),
        ('BINDING', 'Závazná Rezervace'),
        ('INHABITED', 'Obydlený Termín'),
        ('NONBINDING', 'Nezávazná Rezervace'),
    ]
    MEAL_CHOICES = [
        ('NOMEAL', 'Bez Stravy'),
        ('BREAKFAST', 'Jen Snídaně'),
        ('HALFBOARD', 'Polopenze')
    ]
    confirmation_sent = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    deleted = models.BooleanField(default=False)
    from_date = models.DateTimeField(blank=False, null=False, error_messages={
        'invalid': 'Zadejte platný datum začátku rezervace',
        'null': 'Zadejte platný datum začátku rezervace',
    })
    guest = models.ForeignKey(
        Guest,
        on_delete=models.DO_NOTHING,
    )
    hash = models.CharField(blank=True, null=True, default=generate_reservation_hash, max_length=10)
    meal = models.CharField(blank=False, max_length=50, null=False, error_messages={
        'invalid_choice': 'Vyberte údaj Strava ze seznamu',
        'null': 'Vyberte údaj Strava ze seznamu',
    }, choices=MEAL_CHOICES)
    notes = models.TextField(blank=True, null=True)
    price = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Price is required field')
    })
    purpose = models.CharField(blank=True, max_length=100, null=True)
    roommates = models.ManyToManyField(
        Guest,
        related_name='+',
    )
    suite = models.ForeignKey(
        Suite,
        on_delete=models.CASCADE
    )
    to_date = models.DateTimeField(blank=False, null=False, error_messages={
        'invalid': 'Zadejte platný datum konce rezervace',
        'null': 'Zadejte platný datum konce rezervace',
    })
    type = models.CharField(blank=False, max_length=50, null=False, error_messages={
        'invalid_choice': 'Vyberte údaj Typ Rezervace ze seznamu',
        'null': 'Vyberte údaj Typ Rezervace ze seznamu',
    }, choices=TYPE_CHOICES)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.guest)
