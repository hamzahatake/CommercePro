from rest_framework import serializers
from .models import Cart, CartItems

class CartSerializers(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class CartItemsSerializers(serializers.ModelSerializer):
    class Meta:
        model = CartItems
        fields = ['product', 'quantity']

    def add_update(self):
        if self.product.is_active and self.product_stock >= self.quantity:
            if self.quantity == 0:
                self.product.remove()
                self.quantity.save()
            return
        
    @property
    def total_price(self):
        result = self.aggregate(total=sum(self.quantity * self.product_price))
        return result['total']