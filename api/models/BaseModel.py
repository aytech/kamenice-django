from django.db import models

from django.utils.translation import gettext_lazy as _


class BaseModel(models.Model):
    objects = models.Manager()

    AGE_CHOICES = [
        ('INFANT', _('Up to 3 years')),
        ('CHILD', _('3-12 years')),
        ('YOUNG', _('12+ years')),
        ('ADULT', _('Adult')),
    ]

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female')
    ]

    class Meta:
        abstract = True
