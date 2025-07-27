from django.urls import path
from .views import (
    data_views,
    auth_views,
    conversation_views
)

urlpatterns = [
    # Authentication endpoints
    path('auth/signup/', auth_views.SignUpView.as_view(), name='signup'),
    path('auth/login/', auth_views.LoginView.as_view(), name='login'),
    path('auth/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('auth/profile/', auth_views.UserProfileView.as_view(), name='profile'),
    
]