from django.db import models

class Order(models.Model):
    statuses = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("shipped", "Shipped")
    ]

    customer = models.ForeignKey("users.User", on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=statuses)
    total_price = models.PositiveIntegerField(max_digits=10, decimal_places=2)
    stripe_payment_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)