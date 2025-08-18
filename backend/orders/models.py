from django.db import models
from users.models import VendorProfile, User
from products.models import Product

class Order(models.Model):
    statuses = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("shipped", "Shipped")
    ]

    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=statuses)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    stripe_payment_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(null=True)


class OrderItem(models.Model):
    order = models.ManyToManyField(Order)
    products = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_snapshot = models.IntegerField()