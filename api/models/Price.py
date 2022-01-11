from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from api.models.BaseModel import BaseModel
from api.models.Reservation import Reservation
from api.models.Suite import Suite


class Price(BaseModel):
    accommodation = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Price for accommodation is required field')
    })
    days = models.IntegerField(blank=False, null=False, validators=[MinValueValidator(1)], error_messages={
        'blank': _('To calculate price, the number of days should be at least 1.'),
        'null': _('To calculate price, the number of days should be at least 1.'),
        'min_value': _('To calculate price, the number of days should be at least 1.')
    })
    meal = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Price for meal is required field')
    })
    municipality = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Municipality fee is required field')
    })
    reservation = models.ForeignKey(
        Reservation,
        on_delete=models.CASCADE
    )
    suite = models.ForeignKey(
        Suite,
        on_delete=models.CASCADE
    )
    total = models.DecimalField(blank=False, decimal_places=2, max_digits=10, null=False, error_messages={
        'null': _('Total price is required field')
    })
