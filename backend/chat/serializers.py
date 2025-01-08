from rest_framework import serializers
from .models import ChatRoom, Message
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'



class ChatRoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    last_messaged_date = serializers.SerializerMethodField()
    is_seen = serializers.SerializerMethodField()
    class Meta:
        model = ChatRoom
        fields = '__all__'
    
    def get_last_message(self,instance):
        data = None
        messages = Message.objects.filter(chat_room=instance)
        if messages:
            data = messages.last().content
        return data
    
    def get_last_messaged_date(self,instance):
        data = None
        messages = Message.objects.filter(chat_room=instance)
        if messages:
            data = messages.last().timestamp
        return data
    
    def get_is_seen(self,instance):
        data = None
        messages = Message.objects.filter(chat_room=instance)
        if messages:
            data = messages.last().is_seen
        return data
        
        
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
