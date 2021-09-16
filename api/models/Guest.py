from django.core.validators import validate_email
from django.db import models

from api.models.BaseModel import BaseModel
from kamenice_django.validators.guest import validate_citizenship, validate_gender

from django.utils.translation import gettext_lazy as _


class Guest(BaseModel):
    address_municipality = models.CharField(blank=True, max_length=100, null=True)
    address_psc = models.IntegerField(blank=True, null=True)
    address_street = models.CharField(blank=True, max_length=100, null=True)
    age = models.CharField(blank=True, max_length=10, null=True, error_messages={
        'invalid_choice': _('Choose age from the list'),
    }, choices=BaseModel.AGE_CHOICES)
    citizenship = models.CharField(blank=True, max_length=10, null=True, validators=[validate_citizenship])
    email = models.EmailField(blank=False, null=False, validators=[validate_email], error_messages={
        'blank': _('E-Mail is required field'),
        'invalid': _('Enter valid email address'),
        'null': _('E-Mail is required field'),
        'unique': _('User with this email already exists'),
    })
    gender = models.CharField(blank=True, max_length=10, null=True, error_messages={
        'invalid_choice': _('Choose gender from the list')
    }, choices=BaseModel.GENDER_CHOICES, validators=[validate_gender])
    identity = models.CharField(blank=True, max_length=50, null=True)
    name = models.CharField(blank=False, max_length=100, null=False, error_messages={
        'blank': _('Name is required field'),
        'null': _('Name is required field'),
    })
    phone_number = models.CharField(blank=True, max_length=50, null=True)
    surname = models.CharField(blank=False, max_length=100, null=False, error_messages={
        'blank': _('Surname is required field'),
        'null': _('Surname is required field'),
    })
    visa_number = models.CharField(blank=True, max_length=100, null=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return '{} {}'.format(self.name, self.surname)
