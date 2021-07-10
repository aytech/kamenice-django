from django.db import models

from api.models.BaseModel import BaseModel


class Suite(BaseModel):
    title = models.CharField(blank=False, max_length=100, null=False, error_messages={
        'blank': 'Název apartmá je povinný údaj',
        'null': 'Název apartmá je povinný údaj',
    })
    number = models.IntegerField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title
