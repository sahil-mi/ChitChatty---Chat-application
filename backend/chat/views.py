from rest_framework import generics
from rest_framework.mixins import ListModelMixin,CreateModelMixin,RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.contrib.auth.models import User
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer,UserSerializer



class UsersView(ListModelMixin,generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self,request,*args,**kwargs):
        print(request.user.username)
        chatroom_queryset = ChatRoom.objects.filter(is_group=False)
        participants_id_list = chatroom_queryset.values_list("participants")
        self.queryset = self.queryset.exclude(id__in = participants_id_list)
        return self.list(request,*args,**kwargs)
    

class ChatRoomView(ListModelMixin,CreateModelMixin, generics.GenericAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self,request,*args,**kwargs):
        return self.create(request, *args, **kwargs)
    
    def perform_create(self,serializer):
        chat_room  = serializer.save(created_user=self.request.user)
        chat_room.participants.add(self.request.user)




class MessageView(ListModelMixin,CreateModelMixin, generics.GenericAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
    def get(self, request, *args, **kwargs):
        chatroom_id = kwargs["id"]
        chatroom = ChatRoom.objects.get(id=chatroom_id)
        self.queryset = self.queryset.filter(chat_room=chatroom)
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        chatroom_id = kwargs["id"]
        chatroom = ChatRoom.objects.get(id=chatroom_id)
        
        response_data = {
            "data":response.data,
            "name":chatroom.name
        }
        return Response(response_data)


    def post(self,request,*args,**kwargs):
        return self.create(request, *args, **kwargs)