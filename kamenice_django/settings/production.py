import mimetypes
from .base import *

mimetypes.add_type("text/javascript", ".js", True)

ALLOWED_HOSTS = [
    'kamenice.pythonanywhere.com',
]

GRAPHQL_JWT = {
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_LONG_RUNNING_REFRESH_TOKEN': True,
    'JWT_EXPIRATION_DELTA': timedelta(minutes=5),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),
}

DEBUG = False
