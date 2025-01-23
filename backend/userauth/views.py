from django.shortcuts import render

# Create your views here.

from .serializers import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
# Create your views here.
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Get the response from the original TokenObtainPairView
        response = super().post(request, *args, **kwargs)
        
        # Decode the token to get the user
        access_token = response.data.get("access")
        if access_token:
            # Use JWTAuthentication to get the user from the token
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(access_token)
            user = jwt_auth.get_user(validated_token)

            # Add the username to the response data
            response.data['username'] = user.first_name

        return response

@api_view(["POST"])
@permission_classes([AllowAny])
def Signup(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data":serializer.data,"message":"success"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


    
