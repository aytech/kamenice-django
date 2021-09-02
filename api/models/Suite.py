from django.db import models
from django.utils.translation import gettext_lazy as _

from api.models.BaseModel import BaseModel


class Suite(BaseModel):
    title = models.CharField(blank=False, max_length=100, null=False, error_messages={
        'blank': 'Název apartmá je povinný údaj',
        'null': 'Název apartmá je povinný údaj',
    })
    number = models.IntegerField(blank=True, null=True)
    price_base = models.DecimalField(null=False, blank=False, max_digits=6, decimal_places=2, error_messages={
        'null': _('Base price is required field')
    })
    price_child = models.DecimalField(null=False, blank=False, max_digits=6, decimal_places=2, error_messages={
        'null': _('Price for child is required field')
    })
    price_extra = models.DecimalField(null=False, blank=False, max_digits=6, decimal_places=2, error_messages={
        'null': _('Price for extra bed is required field')
    })
    price_infant = models.DecimalField(null=False, blank=False, max_digits=6, decimal_places=2, error_messages={
        'null': _('Price for child is required field')
    })
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title
