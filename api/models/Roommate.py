from api.models.BaseModel import BaseModel
from api.models.Guest import Guest
from django.db import models

from api.models.Reservation import Reservation


class Roommate(BaseModel):
    entity = models.ForeignKey(
        Guest,
        on_delete=models.DO_NOTHING,
    )
    from_date = models.DateTimeField()
    reservation = models.ForeignKey(
        Reservation,
        on_delete=models.DO_NOTHING
    )
    to_date = models.DateTimeField()
