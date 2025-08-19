from django.db import models
from users.models import User
from products.models import Product

class WishList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
class WishListItem(models.Model):
    wishlist = models.ForeignKey(WishList, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
           constraints = [models.UniqueConstraint(fields=['wishlist', 'product'], name='unique_wishlist_product')]