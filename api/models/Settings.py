from django.db import models

from api.models.BaseModel import BaseModel
from api.constants import DEFAULT_ARRIVAL_TIME, DEFAULT_DEPARTURE_TIME


class Settings(BaseModel):
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    default_arrival_time = models.TimeField(null=False, default=DEFAULT_ARRIVAL_TIME)
    default_departure_time = models.TimeField(null=False, default=DEFAULT_DEPARTURE_TIME)
    deleted = models.BooleanField(default=False)
    municipality_fee = models.DecimalField(blank=True, decimal_places=2, default='0.00', max_digits=6, null=True)
    price_breakfast = models.DecimalField(blank=True, decimal_places=2, default='0.00', max_digits=6, null=True)
    price_breakfast_child = models.DecimalField(blank=True, decimal_places=2, default='0.00', max_digits=6, null=True)
    price_halfboard = models.DecimalField(blank=True, decimal_places=2, default='0.00', max_digits=6, null=True)
    price_halfboard_child = models.DecimalField(blank=True, decimal_places=2, default='0.00', max_digits=6, null=True)
    updated = models.DateTimeField(auto_now=True)
    user_avatar = models.CharField(blank=True, max_length=150, null=True)
    user_color = models.CharField(blank=True, max_length=50, null=True)
    user_name = models.CharField(blank=True, max_length=100, null=True)
    username = models.CharField(blank=False, max_length=100, null=False)

    class Meta:
        default_permissions = ()
        permissions = [('change_settings', 'Can change settings')]
