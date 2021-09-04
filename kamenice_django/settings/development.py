from .base import *
from datetime import timedelta

APP_URL = 'http://localhost:3000'

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

REPLY_TO_EMAIL_ADDRESS = 'Oleg Yapparov <oyapparov@gmail.com>'
TO_EMAIL_RECIPIENTS = ['Oleg Yapparov <oyapparov@gmail.com>']
BCC_EMAIL_RECIPIENTS = ['Oleg Yapparov <oyapparov@gmail.com>']
