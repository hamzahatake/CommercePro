from rest_framework import serializers
from .models import Wishlist, Product

class ProductSerializers(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "title", "price"]


class WishlistSerializers(serializers.ModelSerializer):
    product = ProductSerializers(many=True, read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source="product")

    class Meta:
        model = Wishlist
        fields = ["id", "product", "created_at"]
        read_only_fields = ["id", "customer", "products"]