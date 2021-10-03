from django.db import models

from api.models.BaseModel import BaseModel


class User(BaseModel):
    color = models.CharField(blank=False, max_length=50, null=False)
    name = models.CharField(blank=True, max_length=100, null=True)
    surname = models.CharField(blank=True, max_length=100, null=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now=True)
    username = models.CharField(blank=False, max_length=100, null=False)
    deleted = models.BooleanField(default=False)
