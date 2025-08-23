from django.db import models
from .validators import checking_product_stock, zero_quantity


class Cart(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)


class CartItems(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1, validators=[zero_quantity, checking_product_stock])

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['cart', 'product'], name='unique_cart_product')
        ]
