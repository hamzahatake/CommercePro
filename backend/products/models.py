from django.db import models
from django.utils.text import slugify
from .validators import pricing_rule, validate_image

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True, blank=True, db_index=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    vendor = models.ForeignKey("users.VendorProfile", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = models.SlugField(blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[pricing_rule])
    stock = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['title', 'category_id', 'vendor_id']),
            models.Index(fields=['slug'])
        ]
        constraints = [
            models.UniqueConstraint(fields=['slug', 'vendor'], name="unique_slug_vendor")
        ]

    def slug_title(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super.save(*args, **kwargs)

    def __str__(self):
        return f'{self.title} ({self.vendor})'


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(blank=False, validators=[validate_image])

    def __str__(self):
        return f"Image for {self.product.title}"