from rest_framework.permissions import BasePermission

class IsVendorOrAdmin(BasePermission):
    """
    Custom permission to only allow vendors to access their own products,
    or admins to access all products.
    """
    
    def has_permission(self, request, view):
        # Allow authenticated users to access the view
        if not request.user.is_authenticated:
            return False
        
        # Allow vendors and admins
        return request.user.role in ['vendor', 'admin'] or request.user.is_superuser
  
    def has_object_permission(self, request, view, obj):
        # Admin override
        if request.user.is_superuser or request.user.role == 'admin':
            return True
        
        # Vendor can only access their own products
        if request.user.role == 'vendor' and obj.vendor == request.user:
            return True
        
        return False
