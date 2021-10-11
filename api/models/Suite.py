from django.db import models
from django.utils.translation import gettext_lazy as _

from api.models.BaseModel import BaseModel


class Suite(BaseModel):
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    deleted = models.BooleanField(default=False)
    number = models.IntegerField(blank=True, null=True)
    number_beds = models.IntegerField(blank=False, null=False, default=2)
    number_beds_extra = models.IntegerField(blank=False, null=False, default=2)
    price_base = models.DecimalField(null=False, blank=False, max_digits=6, decimal_places=2, error_messages={
        'null': _('Base price is required field')
    })
    title = models.CharField(blank=False, max_length=100, null=False, error_messages={
        'blank': 'Název apartmá je povinný údaj',
        'null': 'Název apartmá je povinný údaj',
    })
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
