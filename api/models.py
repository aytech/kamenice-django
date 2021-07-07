from django.core.validators import validate_email
from django.db import models

from kamenice_django.validators.guest import validate_citizenship, validate_gender


class BaseModel(models.Model):
    objects = models.Manager()

    class Meta:
        abstract = True


class Guest(BaseModel):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female')
    ]
    address_municipality = models.CharField(blank=True, max_length=100, null=True)
    address_psc = models.IntegerField(blank=True, null=True)
    address_street = models.CharField(blank=True, max_length=100, null=True)
    citizenship = models.CharField(blank=True, max_length=10, null=True, validators=[validate_citizenship])
    email = models.EmailField(blank=False, null=False, validators=[validate_email], error_messages={
        "blank": "E-Mail je povinný údaj",
        'invalid': 'Zadejte platnou e-mailovou adresu',
        "null": "E-Mail je povinný údaj"
    })
    gender = models.CharField(blank=True, max_length=10, null=True, choices=GENDER_CHOICES,
                              validators=[validate_gender], error_messages={'invalid_choice': 'Vyberte údaj "Pohlaví" '
                                                                                              'ze seznamu'})
    identity = models.CharField(blank=False, max_length=50, null=False, error_messages={
        "blank": "Číslo občanského průkazu je povinný údaj",
        "null": "Číslo občanského průkazu je povinný údaj"
    })
    name = models.CharField(blank=False, max_length=100, null=False, error_messages={
        "blank": "Jméno je povinný údaj",
        "null": "Jméno je povinný údaj"
    })
    phone_number = models.CharField(blank=False, max_length=50, null=False, error_messages={
        "blank": "Telefonní číslo je povinný údaj",
        "null": "Telefonní číslo je povinný údaj"
    })
    surname = models.CharField(blank=False, max_length=100, null=False, error_messages={
        "blank": "Příjmení je povinný údaj",
        "null": "Příjmení je povinný údaj"
    })
    visa_number = models.CharField(blank=True, max_length=100, null=True)

    def __str__(self):
        return '{} {}'.format(self.name, self.surname)
