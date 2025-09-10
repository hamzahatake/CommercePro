from rest_framework import serializers
from .models import Product, Category, ProductVariant, ProductSize, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text"]
        read_only_fields = ["id"]


class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ["id", "size_label", "stock"]
        read_only_fields = ["id"]


class ProductVariantSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    sizes = ProductSizeSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ["id", "product", "color_name", "hex_code", "images", "sizes"]
        read_only_fields = ["id", "product"]


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(
        write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "base_price",
            "category",
            "category_id",
            "is_active",
            "created_at",
            "updated_at",
            "variants",
        ]
        read_only_fields = ["id", "vendor", "slug", "created_at", "updated_at"]

    def validate_base_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be positive.")
        return value


class ProductPublicSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    vendor_name = serializers.CharField(source="vendor.username", read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "base_price",
            "category",
            "vendor_name",
            "created_at",
            "variants",
        ]
        read_only_fields = fields
