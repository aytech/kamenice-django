from django.db import models


class BaseModel(models.Model):
    objects = models.Manager()

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

    class Meta:
        abstract = True
