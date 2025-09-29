from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class IsVendorUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'vendor'


class IsCustomerUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'customer'


class HasPermission(BasePermission):
    """
    Custom permission class that checks if the user has a specific permission
    based on their role using the dynamic permission system.
    """
    
    def __init__(self, permission_codename):
        self.permission_codename = permission_codename
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.has_permission(self.permission_codename)


class HasAnyPermission(BasePermission):
    """
    Custom permission class that checks if the user has any of the specified permissions.
    """
    
    def __init__(self, permission_codenames):
        self.permission_codenames = permission_codenames if isinstance(permission_codenames, list) else [permission_codenames]
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return any(request.user.has_permission(codename) for codename in self.permission_codenames)


class HasAllPermissions(BasePermission):
    """
    Custom permission class that checks if the user has all of the specified permissions.
    """
    
    def __init__(self, permission_codenames):
        self.permission_codenames = permission_codenames if isinstance(permission_codenames, list) else [permission_codenames]
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return all(request.user.has_permission(codename) for codename in self.permission_codenames)


class IsAdminOrHasPermission(BasePermission):
    """
    Permission class that allows access if user is admin OR has the specified permission.
    """
    
    def __init__(self, permission_codename):
        self.permission_codename = permission_codename
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return (request.user.role == "admin" or 
                request.user.has_permission(self.permission_codename))


class IsVendorOrAdmin(BasePermission):
    """
    Permission class that allows access if user is vendor or admin.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.role in ['vendor', 'admin']


class IsManagerOrAdmin(BasePermission):
    """
    Permission class that allows access if user is manager or admin.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.role in ['manager', 'admin']
