from django.db import models
from users.models import VendorProfile

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

class Product(models.Model):
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)