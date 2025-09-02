from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description', 'price', 
            'stock', 'category', 'category_id', 'image', 
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'vendor', 'slug', 'created_at', 'updated_at']

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be positive.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value

class ProductPublicSerializer(serializers.ModelSerializer):
    """Serializer for public product listing (customers)"""
    category = CategorySerializer(read_only=True)
    vendor_name = serializers.CharField(source='vendor.username', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description', 'price', 
            'stock', 'category', 'image', 'vendor_name', 
            'created_at'
        ]
        read_only_fields = ['id', 'title', 'slug', 'description', 'price', 
                           'stock', 'category', 'image', 'vendor_name', 'created_at']
