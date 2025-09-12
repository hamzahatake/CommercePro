from rest_framework import serializers
from .models import (
    Product, 
    Category, 
    ProductVariant, 
    ProductSize, 
    ProductImage,
    ProductMediaSection,
    ProductMediaItem
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image_url"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None


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
        fields = ["id", "product", "color_name", "hex_code", "price_override", "images", "sizes"]
        read_only_fields = ["id", "product"]


class ProductMediaItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField() 

    class Meta:
        model = ProductMediaItem
        fields = ["id", "item_type", "image_url", "video_url", "text", "order"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None


class ProductMediaSectionSerializer(serializers.ModelSerializer):
    items = ProductMediaItemSerializer(many=True, read_only=True)

    class Meta:
        model = ProductMediaSection
        fields = ["id", "section_type", "order", "items"]
        read_only = fields


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(
        write_only=True, required=False, allow_null=True
    )
    media_sections = ProductMediaSectionSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "badge",
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
            "media_sections",
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
            "badge",
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
