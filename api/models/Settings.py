from django.db import models

from api.models.BaseModel import BaseModel


class Settings(BaseModel):
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    deleted = models.BooleanField(default=False)
    municipality_fee = models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=6, null=True)
    price_breakfast = models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=6, null=True)
    price_halfboard = models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=6, null=True)
    updated = models.DateTimeField(auto_now=True)
    user_avatar = models.CharField(blank=True, max_length=150, null=True)
    user_color = models.CharField(blank=True, max_length=50, null=True)
    user_name = models.CharField(blank=True, max_length=100, null=True)
    username = models.CharField(blank=False, max_length=100, null=False)
