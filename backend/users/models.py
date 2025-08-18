from django.db import models
from django.contrib.auth.models import AbstractUser
from orders.models import Order
from django.db.models import Sum

class User(AbstractUser):
    Role_Choices = [
        ("customer", "Customer"),
        ("vendor", "Vendors"),
        ("admin", "Admin")
    ]

    role = models.CharField(max_length=50, choices=Role_Choices, blank=False)
    is_active = models.BooleanField(default=False)


class VendorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    business_name = models.CharField(max_length=255)
    approved_at = models.DateTimeField(null=True)
    total_sales = models.IntegerField(null=True)

    @property
    def sales(self):
        result = Order.objects.filter(
            vendor=self, status='paid').aggregate(total=Sum('total_sales'))
        
        return result['total'] or 0