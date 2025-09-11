def product_main_image_path(instance, filename):
    # Kept for historical migrations compatibility
    return f"products/{getattr(instance, 'slug', 'product')}/main/{filename}"
def product_variant_image_path(instance, filename):
    product_slug = instance.variant.product.slug if instance.variant and instance.variant.product else "unsaved_product"
    variant_color = instance.variant.color_name if instance.variant else "unsaved_variant"
    return f"products/{product_slug}/variants/{variant_color}/{filename}"