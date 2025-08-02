from rest_framework import permissions

class IsNormalUser(permissions.BasePermission):
    """Allows access only to normal users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'user'

class IsConversationOwner(permissions.BasePermission):
    """Allows access only to conversation owners"""
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user