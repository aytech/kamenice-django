from datetime import datetime

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from api.models.BaseModel import BaseModel
from api.models.Guest import Guest
from api.models.Suite import Suite


class Reservation(BaseModel):
    year = datetime.now().year
    TYPE_CHOICES = [
        ('accommodated', 'Aktuálně Ubytování'),
        ('binding', 'Závazná Rezervace'),
        ('inhabited', 'Obydlený Termín'),
        ('nonbinding', 'Nezávazná Rezervace'),
    ]
    guest = models.ForeignKey(
        Guest,
        on_delete=models.CASCADE,
    )
    roommates = models.ManyToManyField(
        Guest,
        related_name='+',
    )
    suite = models.ForeignKey(
        Suite,
        on_delete=models.CASCADE
    )
    type = models.CharField(blank=False, max_length=50, null=False, error_messages={
        'invalid_choice': 'Vyberte údaj Typ Rezervace ze seznamu',
        'null': 'zadejte typ rezervace'
    }, choices=TYPE_CHOICES)
    from_year = models.IntegerField(blank=False, null=False, validators=[
        MaxValueValidator(year + 1),
        MinValueValidator(year),
    ], error_messages={
        'max_value': 'zadejte rezervaci pro tento nebo příští rok',
        'min_value': 'zadejte rezervaci pro tento nebo příští rok',
        'null': 'zadejte rok začátku rezervace',
    })
    from_month = models.IntegerField(blank=False, null=False, validators=[
        MaxValueValidator(12),
        MinValueValidator(1),
    ], error_messages={
        'max_value': 'zadejte platný měsíc začátku rezervace',
        'min_value': 'zadejte platný měsíc začátku rezervace',
        'null': 'zadejte měsíc začátku rezervace',
    })
    from_day = models.IntegerField(blank=False, null=False, validators=[
        MaxValueValidator(31),
        MinValueValidator(1),
    ], error_messages={
        'max_value': 'zadejte platný den začátku rezervace',
        'min_value': 'zadejte platný den začátku rezervace',
        'null': 'zadejte den začátku rezervace',
    })
    from_hour = models.IntegerField(blank=True, null=True, validators=[
        MaxValueValidator(23),
        MinValueValidator(0),
    ], error_messages={
        'max_value': 'zadejte platnou hodinu začátku rezervace',
        'min_value': 'zadejte platnou hodinu začátku rezervace',
    })
    from_minute = models.IntegerField(blank=True, null=True, validators=[
        MaxValueValidator(59),
        MinValueValidator(0),
    ], error_messages={
        'max_value': 'zadejte platnou minutu začátku rezervace',
        'min_value': 'zadejte platnou minutu začátku rezervace',
    })
    to_year = models.IntegerField(blank=False, null=False, validators=[
        MaxValueValidator(year + 1),
        MinValueValidator(year),
    ], error_messages={
        'max_value': 'zadejte rezervaci pro tento nebo příští rok',
        'min_value': 'zadejte rezervaci pro tento nebo příští rok',
        'null': 'zadejte rok konce rezervace'
    })
    to_month = models.IntegerField(blank=False, null=False, validators=[
        MaxValueValidator(12),
        MinValueValidator(1),
    ], error_messages={
        'max_value': 'zadejte platný měsíc konce rezervace',
        'min_value': 'zadejte platný měsíc konce rezervace',
        'null': 'zadejte měsíc konce rezervace'
    })
    to_day = models.IntegerField(blank=False, null=False, validators=[
        MaxValueValidator(31),
        MinValueValidator(1),
    ], error_messages={
        'max_value': 'zadejte platný den konce rezervace',
        'min_value': 'zadejte platný den konce rezervace',
        'null': 'zadejte den konce rezervace'
    })
    to_hour = models.IntegerField(blank=True, null=True, validators=[
        MaxValueValidator(23),
        MinValueValidator(0),
    ], error_messages={
        'max_value': 'zadejte platnou hodinu konce rezervace',
        'min_value': 'zadejte platnou hodinu konce rezervace',
    })
    to_minute = models.IntegerField(blank=True, null=True, validators=[
        MaxValueValidator(59),
        MinValueValidator(0),
    ], error_messages={
        'max_value': 'zadejte platnou minutu konce rezervace',
        'min_value': 'zadejte platnou minutu konce rezervace',
    })
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return str(self.guest)
