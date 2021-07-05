from django.db import models


class BaseModel(models.Model):
    objects = models.Manager()

    class Meta:
        abstract = True


class Guest(BaseModel):
    address_municipality = models.CharField(blank=True, max_length=100, null=True)
    address_psc = models.IntegerField(blank=True, null=True)
    address_street = models.CharField(blank=True, max_length=100, null=True)
    citizenship = models.CharField(blank=True, max_length=10, null=True)
    email = models.EmailField(blank=False, null=False)
    gender = models.CharField(blank=True, max_length=10, null=True)
    identity = models.CharField(blank=False, max_length=50, null=False)
    name = models.CharField(blank=False, max_length=100, null=False)
    phone_code = models.CharField(blank=False, max_length=20, null=False)
    phone_number = models.CharField(blank=False, max_length=20, null=False)
    surname = models.CharField(blank=False, max_length=100, null=False)
    visa_number = models.CharField(blank=True, max_length=100, null=True)

    def __str__(self):
        return '{} {}'.format(self.name, self.surname)
