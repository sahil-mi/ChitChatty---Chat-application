from rest_framework import serializers
from django.contrib.auth.models import User
import re

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['name','password', 'email']

    def create(self, validated_data):

        print(validated_data['name'])
        print(validated_data['password'])
        print(validated_data['email'])

        user = User.objects.create_user(
            first_name = validated_data["name"],
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user = "user"
        print("user created")
        return user


    def validate_password(self, value):
        # Check the strength of the password
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r'[#@$!%*?&]', value):
            raise serializers.ValidationError("Password must contain at least one special character (e.g., @$!%*?&).")

        return value