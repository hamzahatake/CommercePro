from django.contrib import admin
try:
    import nested_admin as _nested_admin
    NestedTabularInline = _nested_admin.NestedTabularInline
    NestedStackedInline = _nested_admin.NestedStackedInline
    NestedModelAdmin = _nested_admin.NestedModelAdmin
except ImportError:
    NestedTabularInline = admin.TabularInline
    NestedStackedInline = admin.StackedInline
    NestedModelAdmin = admin.ModelAdmin
from django.utils.html import mark_safe
from .models import (
    Category, 
    Product, 
    ProductVariant, 
    ProductSize, 
    ProductImage,
    ProductMediaItem,
    ProductMediaSection
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "product_count"]
    prepopulated_fields = {"slug": ("name",)}

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = "Products"


class ProductImageInline(NestedTabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ["image_preview"]
    can_delete = True
    show_change_link = True

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(
                f'<img src="{obj.image.url}" width="60" height="60" '
                f'style="object-fit:cover; border-radius:5px;" />'
            )
        return "No Image"
    image_preview.short_description = "Preview"


class ProductSizeInline(NestedTabularInline):
    model = ProductSize
    extra = 1
    can_delete = True
    show_change_link = True


class ProductVariantInline(NestedStackedInline):
    model = ProductVariant
    extra = 1
    readonly_fields = ["color_preview"]
    inlines = [ProductImageInline, ProductSizeInline] 

    def color_preview(self, obj):
        if obj.hex_code:
            return mark_safe(
                f'<div style="width:30px; height:30px; border-radius:50%; '
                f'background:{obj.hex_code}; border:1px solid #ccc;"></div>'
            )
        return "No Color"
    color_preview.short_description = "Color"


class ProductMediaItemInline(NestedTabularInline):
    model = ProductMediaItem 
    readonly_fields = ["image_preview"]

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="50" height="50" />')
        return "-"
    
    def get_extra(self, request, obj=None, **kwargs):
        if obj and obj.section_type == "IMAGE_ROW":
            existing_count = obj.items.count()  
            return max(3 - existing_count, 0) 
        return 0


class ProductMediaSectionInline(NestedStackedInline):
    model = ProductMediaSection
    inlines = [ProductMediaItemInline]
    extra = 1
    readonly_fields = []
    fields = ["section_type", "order"]


@admin.register(Product)
class ProductAdmin(NestedModelAdmin): 
    inlines = [ProductVariantInline, ProductMediaSectionInline]
    list_display = ("title", "base_price", "category", "vendor", "is_active", "image_count", "main_image_preview")
    list_filter = ("category", "is_active", "created_at")
    search_fields = ("title", "description")
    readonly_fields = ("created_at", "updated_at", "main_image_preview", "all_images_preview")
    prepopulated_fields = {"slug": ("title",)}
    save_on_top = True

    def main_image_preview(self, obj):
        first_variant = obj.variants.first()
        if first_variant:
            first_image = first_variant.images.first()
            if first_image and first_image.image:
                return mark_safe(
                    f'<img src="{first_image.image.url}" width="50" height="50" '
                    f'style="object-fit:cover; border-radius:5px;" />'
                )
        return "No Image"
    main_image_preview.short_description = "Main Image"

    def image_count(self, obj):
        total_images = sum(variant.images.count() for variant in obj.variants.all())
        return total_images
    image_count.short_description = "Images"

    def all_images_preview(self, obj):
        images_html = []
        for variant in obj.variants.all():
            for image in variant.images.all():
                if image.image:
                    images_html.append(
                        f'<div style="display:inline-block; margin:5px;">'
                        f'<img src="{image.image.url}" width="80" height="80" '
                        f'style="object-fit:cover;" />'
                        f'</div>'
                    )
        return mark_safe(''.join(images_html)) if images_html else "No Images"
    all_images_preview.short_description = "All Product Images"


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ["id", "variant", "image_preview", "product_title"]
    list_filter = ["variant__product__category", "variant__product__vendor"]
    search_fields = ["variant__product__title", "variant__color_name"]
    readonly_fields = ["image_preview"]
    list_per_page = 20

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(
                f'<img src="{obj.image.url}" width="50" height="50" '
            )
        return "No Image"
    image_preview.short_description = "Preview"

    def product_title(self, obj):
        return obj.variant.product.title
    product_title.short_description = "Product"

    def get_queryset(self, request):
        """Optimize queries by prefetching related objects"""
        return super().get_queryset(request).select_related(
            'variant__product__category', 
            'variant__product__vendor'
        )


@admin.register(ProductSize)
class ProductSizeAdmin(admin.ModelAdmin):
    list_display = ["id", "variant", "size_label", "stock"]
    search_fields = ["variant__product__title", "variant__color_name", "size_label"]
