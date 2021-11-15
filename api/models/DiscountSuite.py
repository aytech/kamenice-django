from django.db import models
from django.utils.translation import gettext_lazy as _

from api.constants import DISCOUNT_CHOICE_EXTRA_BED, DISCOUNT_CHOICE_CHILD, DISCOUNT_CHOICE_THREE_NIGHTS, \
    DISCOUNT_CHOICE_INFANT, DISCOUNT_CHOICE_FIFTH_MORE_BED, DISCOUNT_CHOICE_THIRD_FOURTH_BED
from api.models.BaseModel import BaseModel
from api.models.Suite import Suite


class DiscountSuite(BaseModel):
    DISCOUNT_CHOICES = [
        (DISCOUNT_CHOICE_CHILD, _('Child 3-12 years old')),
        (DISCOUNT_CHOICE_EXTRA_BED, _('Extra bed')),
        (DISCOUNT_CHOICE_FIFTH_MORE_BED, _('Fifth and more bed')),
        (DISCOUNT_CHOICE_INFANT, _('Child up to 3 years old')),
        (DISCOUNT_CHOICE_THIRD_FOURTH_BED, _('Third and forth bed')),
        (DISCOUNT_CHOICE_THREE_NIGHTS, _('Three or more nights')),
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

    class Meta:
        db_table = 'api_discount_suite'
        default_permissions = ()
        default_related_name = 'discount_suite_set'

    @staticmethod
    def get_discount_choice(choice):
        for discount in DiscountSuite.DISCOUNT_CHOICES:
            if discount[0] == choice:
                return discount[1]
        return ''
