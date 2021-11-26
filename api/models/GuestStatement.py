from django.db import models

from api.models.BaseModel import BaseModel


class GuestStatement(BaseModel):
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    drive_id = models.CharField(blank=False, null=False, max_length=50)
    name = models.CharField(blank=False, null=False, max_length=50)
    path_pdf = models.CharField(blank=True, null=True, max_length=100)
    path_docx = models.CharField(blank=True, null=True, max_length=100)

    class Meta:
        db_table = 'api_guest_statement'
