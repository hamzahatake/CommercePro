from django.contrib import admin, messages
from django.utils import timezone
from django.db import transaction
from django.urls import path
from django.shortcuts import redirect
from django.utils.html import format_html
from .models import User, VendorProfile

admin.site.register(User)

"--- Admin Action Functions ---"

def approve_vendors(modeladmin, request, queryset):
    if not request.user.is_superuser:
        messages.error(request, "Only admins can approve vendors!")
        return 
    
    with transaction.atomic():
        for vendor in queryset:
            vendor.user.is_active = True
            vendor.approved_at = timezone.now()
            vendor.approved_by = request.user
            vendor.approval_status = 'approved'
            vendor.user.save()
            vendor.save()
 
    messages.success(request, "Selected vendors are approved.")
approve_vendors.short_description = "Approve selected vendors"

def reject_vendors(modeladmin, request, queryset):
    if not request.user.is_superuser:
        messages.error(request, "Only admin can reject vendors!")
        return
    
    with transaction.atomic():
        for vendor in queryset:
            vendor.user.is_active = False
            vendor.approved_by = request.user
            vendor.approval_status = 'rejected'
            vendor.user.save()
            vendor.save()
 
    messages.success(request, "Selected vendors are rejected.")
reject_vendors.short_description = "Reject selected vendors"

def suspend_vendors(modeladmin, request, queryset):
    if not request.user.is_superuser:
        messages.error(request, "Only admin can suspend a vendor!")
        return

    with transaction.atomic():
        for vendor in queryset:
            vendor.approval_status = "suspended"
            vendor.approved_by = request.user
            vendor.user.is_active = False
            vendor.user.save()
            vendor.save()

    messages.info(request, "Selected vendors suspended.")
suspend_vendors.short_description = "Suspend selected vendors"

# --- Admin Class ---

@admin.register(VendorProfile)
class VendorProfileAdmin(admin.ModelAdmin):
    def user_is_active(self, obj):
        return obj.user.is_active
    user_is_active.boolean = True
    
    def get_urls(self):
        urls = super().get_urls()
        custom_url = [
            path('<int:vendor_id>/approve/', self.admin_site.admin_view(self.approve_vendor), name="vendor-approve"),
            path('<int:vendor_id>/reject/', self.admin_site.admin_view(self.reject_vendor), name="vendor-reject")
        ]
        return custom_url + urls

    def approve_vendor(self, request, vendor_id):
        vendor = VendorProfile.objects.get(id=vendor_id)
        if vendor.approval_status != "approved":
            vendor.approval_status = "approved"
            vendor.approved_at = timezone.now()
            vendor.approved_by = request.user
            vendor.user.is_active = True
            vendor.user.save()
            vendor.save()

        self.message_user(request, f'{vendor.business_name} approved!')
        return redirect(f'../../{vendor.id}/change/')            

    def reject_vendor(self, request, vendor_id):
        vendor = VendorProfile.objects.get(id=vendor_id)

        if vendor.user == request.user:
            self.message_user(request, "U can't do this to me", level=messages.ERROR)
            return redirect("..")

        if vendor.approval_status != "rejected":
            vendor.approval_status = "rejected"
            vendor.approved_by = request.user
            vendor.user.is_active = False
            vendor.user.save()
            vendor.save()

        self.message_user(request, f'{vendor.business_name} rejected!')
        return redirect(f'../../{vendor.id}/change/')
        
    def approve_button(self, obj):
        return format_html('<a class="button" href="{}">Approve</a>', f"{obj.id}/approve/")
    approve_button.short_description = "Approve"  

    def reject_button(self, obj):
        return format_html('<a class="button" href="{}">Reject</a>', f"{obj.id}/reject/")
    reject_button.short_description = "Reject"



    list_display = (
        "business_name",
        "legal_name",
        "email",
        "approved_at",
        "approved_by",
        "approval_status",
        "user_is_active",
        "approve_button",
        "reject_button",
    )
    list_filter = ("approved_at",)
    search_fields = ("business_name", "legal_name", "email")
    readonly_fields = ("approved_at", "approved_by", "approval_status")
    actions = [approve_vendors, reject_vendors, suspend_vendors]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")