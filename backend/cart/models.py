from django.db import models
from users.models import User
from products.models import Product

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class CartItems(models.Model):
    cart = models.ManyToManyField(Cart)
    products = models.ForeignKey(Product)
    quantity = models.PositiveIntegerField(default=1)

