from graphql_jwt.exceptions import JSONWebTokenError
from django.utils.translation import gettext_lazy as _


class PermissionDenied(JSONWebTokenError):
    default_message = _('You do not have permission to access this feature, please contact administrator')
