from django.utils.translation import gettext_lazy as _


class DateHelper:
    MONTHS = (
        _('January'),
        _('February'),
        _('March'),
        _('April'),
        _('May'),
        _('June'),
        _('July'),
        _('August'),
        _('September'),
        _('October'),
        _('November'),
        _('December'),
    )

    @staticmethod
    def get_formatted_date(date):
        return '{} {} {}'.format(date.day, DateHelper.MONTHS[date.month - 1], date.year)
