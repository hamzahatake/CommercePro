from django.db import models
from django.utils.text import slugify
from django.conf import settings
from .validators import pricing_rule, validate_image

User = settings.AUTH_USER_MODEL


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True, db_index=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=255)
    slug = models.SlugField(blank=True, unique=True)
    description = models.TextField(blank=True)
    main_image = models.ImageField(
        upload_to="products/main_images/",
        blank=True,
        null=True,
        default="products/default.png"
    )
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[pricing_rule], null=True, blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )
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

    def __str__(self):
        return f'{self.title} ({self.vendor})'


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    color_name = models.CharField(max_length=50)
    hex_code = models.CharField(max_length=7, blank=True)  # e.g. "#FFFFFF"
    price_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.product.title} - {self.color_name}"


class ProductImage(models.Model):
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name='images',
        null=True,  
        blank=True,
    )

    image = models.ImageField(
        upload_to='products/variants/',
        validators=[validate_image]
    )

    def __str__(self):
        return f"Image for {self.variant}"


class ProductSize(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='sizes')
    size_label = models.CharField(max_length=10)  # e.g. "US 9", "EU 42"
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.variant} - {self.size_label} ({self.stock} in stock)"