from django.contrib import admin
from django.utils.html import mark_safe
from .models import Category, Product, ProductImage

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'price', 'stock', 'category', 
        'vendor', 'created_at', 'updated_at'
    )
    list_filter = ('price', 'stock', 'created_at')
    search_fields = ('title',)
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('title',)} 


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'image']

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(
                f'<img src="{obj.image.url}" width="50" height="50" '
                f'style="object-fit:cover; border-radius:5px;" />'
            )
        return "No Image"

    image_preview.short_description = "Thumbnail"
