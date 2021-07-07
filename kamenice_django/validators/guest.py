from django.core.exceptions import ValidationError


def validate_citizenship(value):
    if len(value) > 10:
        raise ValidationError('Text občanství je příliš dlouhý')


def validate_gender(value):
    if (len(value)) > 10:
        raise ValidationError('Text pohlaví je příliš dlouhý')
