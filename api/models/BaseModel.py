from django.db import models

from django.utils.translation import gettext_lazy as _

from api.constants import AGE_CHOICE_ADULT, AGE_CHOICE_YOUNG, AGE_CHOICE_CHILD, AGE_CHOICE_INFANT


class BaseModel(models.Model):
    objects = models.Manager()

    AGE_CHOICES = [
        (AGE_CHOICE_INFANT, _('Child up to 3 years old')),
        (AGE_CHOICE_CHILD, _('Child 3-12 years old')),
        (AGE_CHOICE_YOUNG, _('12+ years')),
        (AGE_CHOICE_ADULT, _('Adult')),
    ]

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female')
    ]

    class Meta:
        abstract = True
