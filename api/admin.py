from django.contrib import admin

from api.models.Reservation import Reservation


class ReservationAdmin(admin.ModelAdmin):
    fields = ('from_date', 'to_date', 'guest', 'roommates', 'meal', 'notes', 'purpose', 'suite', 'type', 'deleted',
              'hash',)
    readonly_fields = ('hash',)


admin.site.register(Reservation, ReservationAdmin)
