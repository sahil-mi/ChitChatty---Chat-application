from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
import jwt
from django.conf import settings

User = get_user_model()

@sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Get the token from the query string
        query_string = scope.get('query_string', b'').decode()
        token = None
        for param in query_string.split('&'):
            key, _, value = param.partition('=')
            if key == 'token':
                token = value
                break

        # Validate the token and get the user
        if token:
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                scope['user'] = await get_user(payload['user_id'])
            except (jwt.ExpiredSignatureError, jwt.DecodeError, AuthenticationFailed):
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
