from django.urls import path, include
from rest_framework.routers import DefaultRouter
from chatbot_backend.views import (
    conversation_views,
    auth_views,
    
)

# Create router for main resources
router = DefaultRouter()
router.register(r'conversations', conversation_views.ConversationListView, basename='conversation')

urlpatterns = [
    # Authentication endpoints
    path('auth/signup/', auth_views.SignUpView.as_view(), name='signup'),
    path('auth/login/', auth_views.LoginView.as_view(), name='login'),
    path('auth/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('auth/profile/', auth_views.UserProfileView.as_view(), name='profile'),
    
    # Nested message endpoints
    path('conversations/<int:conversation_id>/messages/', 
         conversation_views.MessageListView.as_view({'get': 'list', 'post': 'create'}), 
         name='message-list'),
    
    # Include router URLs
    path('', include(router.urls)),
]