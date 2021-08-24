from .base import *

ALLOWED_HOSTS = [
    'localhost',
]

GRAPHQL_JWT = {
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_LONG_RUNNING_REFRESH_TOKEN': True,
    'JWT_EXPIRATION_DELTA': timedelta(minutes=1),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(minutes=2),
}

DEBUG = True
