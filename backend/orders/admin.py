from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "title_snapshot", "unit_price", "quantity", "vendor", "subtotal")
    can_delete = False

    def subtotal(self, obj):
        return obj.subtotal()

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "total_amount", "currency", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("user__username", "user__email")
    inlines = [OrderItemInline]
    readonly_fields = ("user", "total_amount", "currency", "created_at", "updated_at")

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product", "title_snapshot", "unit_price", "quantity", "vendor", "subtotal")
    search_fields = ("product__title", "order__id")
    readonly_fields = ("order", "product", "title_snapshot", "unit_price", "quantity", "vendor", "subtotal")

    def subtotal(self, obj):
        return obj.subtotal()
