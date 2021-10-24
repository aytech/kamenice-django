from django.db import models
from django.utils.translation import gettext_lazy as _

from api.constants import DISCOUNT_CHOICE_HALFBOARD, DISCOUNT_CHOICE_CHILD_BREAKFAST
from api.models.BaseModel import BaseModel
from api.models.Settings import Settings


class DiscountSettings(BaseModel):
    DISCOUNT_CHOICES = [
        (DISCOUNT_CHOICE_CHILD_BREAKFAST, _('Breakfast (child 3-12 years old)')),
        (DISCOUNT_CHOICE_HALFBOARD, _('Halfboard (child 3-12 years old)')),
    ]
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    deleted = models.BooleanField(default=False)
    settings = models.ForeignKey(Settings, on_delete=models.CASCADE)
    type = models.CharField(blank=False, choices=DISCOUNT_CHOICES, error_messages={
        'invalid_choice': _('Select discount type from the list'),
        'null': _('Select discount type from the list'),
    }, max_length=100, null=False)
    value = models.IntegerField(blank=False, default=0, null=False)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'api_discount_settings'
        default_permissions = ()
        default_related_name = 'discount_settings_set'

    @staticmethod
    def get_discount_choice(choice):
        for discount in DiscountSettings.DISCOUNT_CHOICES:
            if discount[0] == choice:
                return discount[1]
        return ''
