from django.urls import path
from .views import auth_views
from .views.data_views import (
    DataSourceListCreate,
    DataSourceDetail,
    ProcessDataSourceView
)


urlpatterns = [
    path('auth/signup/', auth_views.SignUpView.as_view(), name='signup'),
    path('auth/login/', auth_views.LoginView.as_view(), name='login'),
    path('auth/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('auth/profile/', auth_views.UserProfileView.as_view(), name='profile'),
    path('admin/users/', auth_views.AdminUserView.as_view(), name='admin-users'),

    path('datasources/', DataSourceListCreate.as_view(), name='datasource-list'),
    path('datasources/<int:pk>/', DataSourceDetail.as_view(), name='datasource-detail'),
    path('datasources/<int:pk>/process/', ProcessDataSourceView.as_view(), name='datasource-process'),
]

