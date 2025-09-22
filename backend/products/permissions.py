from rest_framework.permissions import BasePermission

class IsVendorOrAdmin(BasePermission):
    """
    Custom permission to only allow vendors to access their own products,
    or admins to access all products.
    """
    
    def has_permission(self, request):
        if not request.user.is_authenticated:
            return False
        
        return request.user.role in ['vendor', 'admin'] or request.user.is_superuser
  
    def has_object_permission(self, request, obj):
        if request.user.is_superuser or request.user.role == 'admin':
            return True
        
        if request.user.role == 'vendor' and obj.vendor == request.user:
            return True
        
        return False
