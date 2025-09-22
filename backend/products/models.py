from django.db import models
from django.utils.text import slugify
from django.conf import settings
from .validators import pricing_rule, validate_image
from .utils import product_variant_image_path
from rest_framework.validators import ValidationError


User = settings.AUTH_USER_MODEL

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True, db_index=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    badge = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(blank=True, unique=True)
    description = models.TextField(blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[pricing_rule], null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[pricing_rule], null=True, blank=True, help_text="Main product price")
    stock = models.PositiveIntegerField(default=0, help_text="Total stock across all variants")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['title', 'category', 'vendor']),
            models.Index(fields=['slug'])
        ]
        constraints = [
            models.UniqueConstraint(fields=['slug', 'vendor'], name="unique_slug_vendor")
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def sync_price_and_stock(self):
        """Sync price and stock from variants"""
        # Set price to base_price if not set
        if not self.price and self.base_price:
            self.price = self.base_price
        
        # Calculate total stock from all variants
        total_stock = 0
        for variant in self.variants.all():
            for size in variant.sizes.all():
                total_stock += size.stock
        
        self.stock = total_stock
        self.save(update_fields=['stock'])

    def __str__(self):
        return f'{self.title} ({self.vendor})'


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    color_name = models.CharField(max_length=50)
    hex_code = models.CharField(max_length=7, blank=True)
    price_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.product.title} - {self.color_name}"


class ProductImage(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='images', null=True, blank=True,)
    image = models.ImageField(upload_to=product_variant_image_path, validators=[validate_image])

    def __str__(self):
        return f"Image for {self.variant}"


class ProductSize(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='sizes')
    size_label = models.CharField(max_length=10)
    stock = models.PositiveIntegerField(default=0)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Sync product stock when size stock changes
        if self.variant and self.variant.product:
            self.variant.product.sync_price_and_stock()

    def delete(self, *args, **kwargs):
        product = self.variant.product if self.variant else None
        super().delete(*args, **kwargs)
        # Sync product stock when size is deleted
        if product:
            product.sync_price_and_stock()

    def __str__(self):
        return f"{self.variant} - {self.size_label} ({self.stock} in stock)"


class ProductMediaSection(models.Model):
    SECTION_TYPES = [
        ("IMAGE_ROW", "Image Row (3-up)"),
        ("VIDEO", "Video Block"),
        ("COLLAGE", "Collage Grid"),
        ("FULL_IMAGE", "Full-width Image"),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="media_sections")
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.title} - {self.section_type} (Order {self.order})"


class ProductMediaItem(models.Model):
    ITEM_TYPES = [
        ("IMAGE", "Image"),
        ("VIDEO", "Video"),
        ("TEXT", "Text"),
    ]

    section = models.ForeignKey(ProductMediaSection, on_delete=models.CASCADE, related_name="items")
    item_type = models.CharField(max_length=10, choices=ITEM_TYPES)
    image = models.ImageField(upload_to="products/media/", blank=True, null=True, validators=[validate_image])
    video_url = models.URLField(blank=True, null=True, help_text="External video link")
    text = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]
    
    def clean(self):
        if self.section.section_type == "IMAGE_ROW" and not self.image:
            raise ValidationError("Image is required for IMAGE_ROW section")
     
        if self.section.section_type == "VIDEO_ROW" and not self.video_url:
            raise ValidationError("Video URL is required for VIDEO_ROW section")
        
    def __str__(self):
        return f"Item {self.id} in {self.section}"