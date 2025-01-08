# app/consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async

from chat.models import Message,ChatRoom
class Consumer(WebsocketConsumer):

    def connect(self):
        print("connected======")
        self.chat_room_name = self.scope['url_route']['kwargs']['chat_room_name']
        self.room_group_name = 'chat_%s' % self.chat_room_name
        
        user = self.scope["user"]
        if not user.is_authenticated:
            self.close()
            return        

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        # Receive message from WebSocket
        text_data_json = json.loads(text_data)
        text = text_data_json['text']
        roomName = text_data_json["roomName"]
        chat_room = ChatRoom.objects.get(name=roomName)
        sender = self.scope["user"]
        message = async_to_sync(self.save_message)(chat_room, sender, text)        
        
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
            }
        )
        
    @database_sync_to_async
    def save_message(self,chat_room, sender, content):
        message = Message.objects.create(
            chat_room = chat_room,
            sender = sender,
            content = content,
        )
        return message

    def chat_message(self, event):
        # Receive message from room group
        message = event['message']
        content = message.content
        sender = message.sender.username
        is_auth_user = True if message.sender == self.scope['user']  else  False
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'content': content,
            'sender': sender,
            'is_auth_user':is_auth_user
        }))