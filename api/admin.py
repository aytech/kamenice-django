from django.contrib import admin

from api.models.Guest import Guest
from api.models.Reservation import Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    fields = ('from_date', 'to_date', 'guest', 'roommates', 'meal', 'notes', 'purpose', 'suite', 'type', 'deleted',
              'hash',)
    readonly_fields = ('hash',)


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    pass
