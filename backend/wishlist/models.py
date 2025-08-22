from django.db import models 

class WishList(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    
class WishListItem(models.Model):
    wishlist = models.ForeignKey(WishList, on_delete=models.CASCADE)
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)

    class Meta:
           constraints = [
                models.UniqueConstraint(fields=['wishlist', 'product'], name='unique_wishlist_product')
            ]