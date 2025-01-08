from django.urls import path
from .views import ChatRoomView,UsersView,MessageView

urlpatterns = [
    path('users/', UsersView.as_view(), name='user-view'),
    path('chatrooms/', ChatRoomView.as_view(), name='chatroom-view'),
    path('messages/<int:id>/', MessageView.as_view(), name='message-view'),
]
