from django.db import models

from api.models.BaseModel import BaseModel


class Contact(BaseModel):
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    deleted = models.BooleanField(default=False)
    message = models.TextField(blank=False, null=False)

    def __str__(self):
        return self.message
