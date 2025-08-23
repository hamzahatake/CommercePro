from .models import Category, Product, ProductImage
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):
    model = Category
    fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    model = Product
    fields = '__all__'


class ProductImageSerializer(serializers.ModelSerializer):
    model = ProductImage
    fields = '__all__'