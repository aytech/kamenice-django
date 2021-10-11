from django.db import models
from django.utils.translation import gettext_lazy as _

from api.constants import DISCOUNT_CHOICE_EXTRA_BED
from api.models.BaseModel import BaseModel
from api.models.Suite import Suite


class Discount(BaseModel):
    DISCOUNT_CHOICES = [
        (DISCOUNT_CHOICE_EXTRA_BED, _('Extra bed'))
    ]
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    deleted = models.BooleanField(default=False)
    suite = models.ForeignKey(Suite, on_delete=models.CASCADE)
    type = models.CharField(blank=False, choices=DISCOUNT_CHOICES, error_messages={
        'invalid_choice': _('Select discount type from the list'),
        'null': _('Select discount type from the list'),
    }, max_length=100, null=False)
    value = models.IntegerField(blank=False, default=0, null=False)
    updated = models.DateTimeField(auto_now=True)
