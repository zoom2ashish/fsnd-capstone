import json
from flask import request, _request_ctx_stack, abort
from functools import wraps
from jose import jwt
from urllib.request import urlopen
from authlib.integrations.flask_client import OAuth
from os import environ as env

AUTH0_DOMAIN = env.get('AUTH0_DOMAIN')
API_AUDIENCE = env.get('AUTH0_API_AUDIENCE')
ALGORITHMS = ['RS256']


# AuthError Exception
'''
AuthError Exception
A standardized way to communicate auth failure modes
'''

class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    header_value = request.headers.get('Authorization', None)
    if not header_value:
        raise AuthError({
            'code': 'authorization_header_missing',
            'description': 'Authorization header is expected.'
        }, 401)

    token_array = header_value.split(" ")
    if token_array[0].lower() != "bearer":
        raise AuthError({
            'code': 'authorization_header_invalid',
            'description':
                "Authorization Header value must start with 'Bearer'"
        }, 401)

    elif (len(token_array) != 2):
        raise AuthError({
            "code": "authorization_header_invalid",
            "description": "Token not found"
        }, 401)

    elif len(token_array) > 2:
        raise AuthError({
            'code': 'authorization_header_invalid',
            'description': 'Authorization header must be bearer token.'
        }, 401)

    return token_array[1]


def check_permissions(permission, payload):
    permissions = payload.get("permissions", None)

    if (not permissions) or (permission not in permissions):
        raise AuthError({
            "code": "insufficient_permissions",
            "description":
                "You do not have enought permissions to perform the operation."
        }, 403)

    return True


def verify_decode_jwt(token):
    unverified_header = jwt.get_unverified_header(token)
    if unverified_header is None:
        raise AuthError({
            "code": "authorization_header_invalid",
            "description": "Invalid Token"
        }, 401)

    jsonurl = urlopen(f'https://{AUTH0_DOMAIN}/.well-known/jwks.json')
    jwks = json.loads(jsonurl.read())

    rsa_key = {}
    for key in jwks['keys']:
        if key['kid'] == unverified_header['kid']:
            rsa_key = {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e']
            }

    if rsa_key:
        try:
            payload = jwt.decode(token, rsa_key, algorithms=ALGORITHMS,
                                 audience=API_AUDIENCE,
                                 issuer=f"https://{AUTH0_DOMAIN}/")
            return payload
        except jwt.ExpiredSignatureError as e:
            raise AuthError({
                'code': 'token_expired',
                'description': 'Token expired.'
            }, 401)

        except jwt.JWTClaimsError as e:
            raise AuthError({
                'code': 'invalid_claims',
                'description':
                    'Incorrect claims. Please, check the audience and issuer.'
            }, 401)
        except Exception:
            raise AuthError({
                'code': 'invalid_header',
                'description': 'Unable to parse authentication token.'
            }, 400)


def requires_auth(permission=''):
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = get_token_auth_header()
            payload = verify_decode_jwt(token)
            check_permissions(permission, payload)
            return f(payload, *args, **kwargs)

        return wrapper
    return requires_auth_decorator
