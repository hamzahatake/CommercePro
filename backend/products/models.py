from django.db import models
from users.models import VendorProfile

class Categories(models.Model):
    name = models.CharField(max_length=50, unique=True)

class Product(models.Model):
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE)
    Category = models.ForeignKey(Categories)
    title = models.CharField(max_length=225)
    description = models.TextField()
    price = models.DecimalField()
    stock = models.IntegerField()
    image = models.ImageField()
    created_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(null=True)