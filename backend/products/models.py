from django.db import models
from .validators import pricing_rule, stocking_rule

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True, db_index=True)

class Product(models.Model):
    vendor = models.ForeignKey("users.VendorProfile", on_delete=models.CASCADE)
    image = models.ImageField()
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[pricing_rule])
    stock = models.PositiveIntegerField(default=0, validators=[stocking_rule])
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['title', 'slug', 'category_id', 'vendor_id'])
        ]

    