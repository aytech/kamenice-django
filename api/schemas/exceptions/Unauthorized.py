from graphql_jwt.exceptions import JSONWebTokenError


class Unauthorized(JSONWebTokenError):
    default_message = 'Unauthorized'
