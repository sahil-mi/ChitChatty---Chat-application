import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import Message, ChatRoom

class Consumer(WebsocketConsumer):
    def connect(self):
        self.chat_room_name = self.scope['url_route']['kwargs']['chat_room_name']
        self.room_group_name = f'chat_{self.chat_room_name}'

        user = self.scope["user"]
        if not user.is_authenticated:
            self.close()
            return        

        # Add user to room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Remove user from room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        # Receive message from WebSocket
        text_data_json = json.loads(text_data)
        text = text_data_json['text']
        room_name = text_data_json["roomName"]
        sender = self.scope["user"]

        # Get the chat room
        chat_room = async_to_sync(self.get_chat_room)(room_name)

        if not chat_room:
            self.send(text_data=json.dumps({'error': 'Invalid room'}))
            return

        # Save the message
        message = async_to_sync(self.save_message)(chat_room, sender, text)

        # Serialize the message
        serialized_message = {
            'content': message.content,
            'sender': message.sender.username,
            'is_auth_user': message.sender == self.scope['user'],
        }

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serialized_message,
            }
        )

    @database_sync_to_async
    def get_chat_room(self, room_name):
        try:
            return ChatRoom.objects.get(name=room_name)
        except ChatRoom.DoesNotExist:
            return None

    @database_sync_to_async
    def save_message(self, chat_room, sender, content):
        return Message.objects.create(
            chat_room=chat_room,
            sender=sender,
            content=content,
        )

    def chat_message(self, event):
        # Receive message from room group
        message = event['message']

        # Send message to WebSocket (only for this room)
        self.send(text_data=json.dumps(message))
