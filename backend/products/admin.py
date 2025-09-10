import nested_admin
from django.contrib import admin
from django.utils.html import mark_safe
from .models import Category, Product, ProductVariant, ProductSize, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


class ProductImageInline(nested_admin.NestedTabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ["image_preview"]

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(
                f'<img src="{obj.image.url}" width="60" height="60" '
                f'style="object-fit:cover; border-radius:5px;" />'
            )
        return "No Image"
    image_preview.short_description = "Preview"


class ProductSizeInline(nested_admin.NestedTabularInline):
    model = ProductSize
    extra = 1


class ProductVariantInline(nested_admin.NestedStackedInline):
    model = ProductVariant
    extra = 1
    readonly_fields = ["color_preview"]
    inlines = [ProductImageInline, ProductSizeInline]  # ✅ nest images + sizes inside variants

    def color_preview(self, obj):
        if obj.hex_code:
            return mark_safe(
                f'<div style="width:30px; height:30px; border-radius:50%; '
                f'background:{obj.hex_code}; border:1px solid #ccc;"></div>'
            )
        return "No Color"
    color_preview.short_description = "Color"


@admin.register(Product)
class ProductAdmin(nested_admin.NestedModelAdmin): 
    inlines = [ProductVariantInline]
    list_display = ("title", "base_price", "category", "vendor", "is_active", "main_image_preview")
    list_filter = ("category", "is_active", "created_at")
    search_fields = ("title", "description")
    readonly_fields = ("created_at", "updated_at", "main_image_preview")
    prepopulated_fields = {"slug": ("title",)}

    def main_image_preview(self, obj):
        if obj.main_image:
            return mark_safe(
                f'<img src="{obj.main_image.url}" width="60" height="60" style="object-fit:cover; border-radius:5px;" />'
            )
        return "No Image"
    main_image_preview.short_description = "Main Image"
