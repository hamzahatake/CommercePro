from rest_framework import serializers
from .models import Wishlist
from products.models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "title", "base_price", "price", "stock", "is_active", "created_at"]


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True), 
        write_only=True, 
        source="product"
    )

    class Meta:
        model = Wishlist
        fields = ["id", "product", "product_id", "created_at"]
        read_only_fields = ["id", "created_at"]