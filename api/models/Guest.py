from django.core.validators import validate_email
from django.db import models

from api.models.BaseModel import BaseModel
from kamenice_django.validators.guest import validate_citizenship, validate_gender


class Guest(BaseModel):
    AGE_CHOICES = [
        ('INFANT', 'Do 3 let'),
        ('CHILD', '3-12 let'),
        ('YOUNG', '12+'),
        ('ADULT', 'Dospělý'),
    ]
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female')
    ]
    address_municipality = models.CharField(blank=True, max_length=100, null=True)
    address_psc = models.IntegerField(blank=True, null=True)
    address_street = models.CharField(blank=True, max_length=100, null=True)
    age = models.CharField(blank=True, max_length=10, null=True, error_messages={
        'invalid_choice': 'Vyberte věk ze seznamu',
    }, choices=AGE_CHOICES)
    citizenship = models.CharField(blank=True, max_length=10, null=True, validators=[validate_citizenship])
    email = models.EmailField(blank=False, null=False, validators=[validate_email], error_messages={
        'blank': 'E-Mail je povinný údaj',
        'invalid': 'Zadejte platnou e-mailovou adresu',
        'null': 'E-Mail je povinný údaj',
        'unique': 'Uživatel s tímto e-mailem již existuje',
    })
    gender = models.CharField(blank=True, max_length=10, null=True, error_messages={
        'invalid_choice': 'Vyberte údaj Pohlaví ze seznamu'}, choices=GENDER_CHOICES, validators=[validate_gender])
    identity = models.CharField(blank=True, max_length=50, null=True)
    name = models.CharField(blank=False, max_length=100, null=False, error_messages={
        'blank': 'Jméno je povinný údaj',
        'null': 'Jméno je povinný údaj',
    })
    phone_number = models.CharField(blank=True, max_length=50, null=True)
    surname = models.CharField(blank=False, max_length=100, null=False, error_messages={
        'blank': 'Příjmení je povinný údaj',
        'null': 'Příjmení je povinný údaj',
    })
    visa_number = models.CharField(blank=True, max_length=100, null=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return '{} {}'.format(self.name, self.surname)
