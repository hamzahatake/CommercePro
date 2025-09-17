from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source="product.title", read_only=True)
    product_price = serializers.DecimalField(source="product.price", read_only=True, max_digits=10, decimal_places=2)
    subtotal = serializers.SerializerMethodField(read_only=True)

    def validate_quantity(self, value):
        if value < 1 or value > 10:
            raise ValidationError("The quantity should remain under 1-10!")
        return value

    def validate(self, attrs):
        product = attrs["product"]
        quantity = attrs["quantity"]

        if product.stock < 1:
            raise ValidationError("The product is not available!")
        if quantity > product.stock:
            raise ValidationError("Their's shortage in product stock!")
        
        return attrs
    
    def get_subtotal(self, obj):
        return obj.quantity * obj.product.price

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_title', 'product_price', 'quantity', 'subtotal',]
        extra_kwargs = {"product": {"write_only": True}}

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get("quantity", instance.quantity)
        instance.save()

class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField(read_only=True)

    def get_total_price(self, obj):
        return sum(item.quantity * item.product.price for item in obj.cart_items.all())
    
    class Meta:
        model = Cart
        fields = ['id', 'cart_items', 'total_price']