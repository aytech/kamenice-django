import mimetypes
from .base import *

mimetypes.add_type("text/javascript", ".js", True)

ALLOWED_HOSTS = [
    'kamenice.pythonanywhere.com',
]

DEBUG = False
