from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, CustomerProfile, VendorProfile, ManagerProfile, AdminProfile, EmailVerificationToken, PasswordResetToken

class VendorProfileInline(admin.StackedInline):
    model = VendorProfile
    extra = 0

class CustomerProfileInline(admin.StackedInline):
    model = CustomerProfile
    extra = 0

class ManagerProfileInline(admin.StackedInline):
    model = ManagerProfile
    extra = 0

class AdminProfileInline(admin.StackedInline):
    model = AdminProfile
    extra = 0

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "phone_number", "shipping_address"]
    search_fields = ["user__email", "phone_number"]
    readonly_fields = ["user"]


@admin.register(VendorProfile)
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "shop_name", "approved"]
    list_filter = ["approved"]
    search_fields = ["shop_name", "tax_id"]


@admin.register(ManagerProfile)
class ManagerProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "department", "permissions_level"]
    list_filter = ["department"]
    search_fields = ["user__username", "user__email"]


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "access_level"]
    list_filter = ["access_level"]


@admin.register(User)
class UserProfileAdmin(UserAdmin):
    list_display = ["username", "email", "role", "is_active", "is_staff"]
    list_filter = ["role", "is_active"]
    search_fields = ["username", "email"]

    def get_inlines(self, request, obj=None):
        if obj is None:
            return []
        if obj and  obj.role == "customer":
            return [CustomerProfileInline]
        if obj and obj.role == "vendor":
            return [VendorProfileInline]
        if obj and obj.role == "manager":
            return [ManagerProfileInline]
        if obj and obj.role == "admin":
            return [AdminProfileInline]
        return []


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'token_short', 'is_used', 'is_expired', 'created_at']
    list_filter = ['is_used', 'created_at']
    search_fields = ['user__email', 'user__username', 'token']
    readonly_fields = ['token', 'created_at']
    ordering = ['-created_at']
    
    def token_short(self, obj):
        return f"{obj.token[:8]}..." if obj.token else "No token"
    token_short.short_description = "Token"
    
    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True
    is_expired.short_description = "Expired"


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'token_short', 'is_used', 'is_expired', 'created_at']
    list_filter = ['is_used', 'created_at']
    search_fields = ['user__email', 'user__username', 'token']
    readonly_fields = ['token', 'created_at']
    ordering = ['-created_at']
    
    def token_short(self, obj):
        return f"{obj.token[:8]}..." if obj.token else "No token"
    token_short.short_description = "Token"
    
    def is_expired(self, obj):
        return obj.is_expired()
    is_expired.boolean = True
    is_expired.short_description = "Expired"