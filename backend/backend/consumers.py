# app/consumers.py
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class Consumer(WebsocketConsumer):

    def connect(self):
        print("connected======")
        self.chat_room_name = self.scope['url_route']['kwargs']['chat_room_name']
        self.room_group_name = 'chat_%s' % self.chat_room_name
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
        sender = text_data_json['sender']
        
        print(text,"=============")
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': text,
                'sender': sender
            }
        )

    def chat_message(self, event):
        # Receive message from room group
        text = event['message']
        print(text,"===========>>>>2")
        sender = event['sender']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'text': text,
            'sender': sender
        }))