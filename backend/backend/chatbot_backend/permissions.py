from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """Allows access only to admin users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin_user

class IsNormalUser(permissions.BasePermission):
    """Allows access only to normal users"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'user'

class IsOwnerOrAdmin(permissions.BasePermission):
    """Allows access to object owners or admins"""
    def has_object_permission(self, request, view, obj):
        # For models with direct user relation
        if hasattr(obj, 'user'):
            return request.user.is_admin_user or obj.user == request.user
        
        # For models with created_by relation
        if hasattr(obj, 'created_by'):
            return request.user.is_admin_user or obj.created_by == request.user
        
        return False
    
class IsConversationOwner(permissions.BasePermission):
    """Allows access only to conversation owners"""
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user