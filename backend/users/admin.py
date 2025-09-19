from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, CustomerProfile, VendorProfile, ManagerProfile, AdminProfile

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