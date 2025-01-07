from rest_framework import generics
from rest_framework.mixins import ListModelMixin,CreateModelMixin
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User

from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer,UserSerializer



class UsersView(ListModelMixin,generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self,request,*args,**kwargs):
        chatroom_queryset = ChatRoom.objects.filter(is_group=False)
        participants_id_list = chatroom_queryset.values_list("participants")
        self.queryset = self.queryset.exclude(id__in = participants_id_list)
        return self.list(request,*args,**kwargs)
    

class ChatRoomView(ListModelMixin,CreateModelMixin, generics.GenericAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self,request,*args,**kwargs):
        return self.create(request, *args, **kwargs)




class MessageView(ListModelMixin,CreateModelMixin, generics.GenericAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self,request,*args,**kwargs):
        return self.create(request, *args, **kwargs)