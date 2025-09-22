from rest_framework import serializers
from .models import Order, OrderItem


class CreatePaymentIntentResponseSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    client_secret = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    currency = serializers.CharField()


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source="title_snapshot", read_only=True)
    vendor_id = serializers.IntegerField(source="vendor.id", read_only=True)
    vendor_name = serializers.CharField(source="vendor.user.username", read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",        
            "product_title",
            "vendor_id",       
            "vendor_name",
            "quantity",
            "unit_price",
            "subtotal",
        ]
        read_only_fields = ["product_title", "vendor_id", "vendor_name", "subtotal"]

    def get_subtotal(self, obj):
        return obj.subtotal()   


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",            
            "status",
            "total_amount",
            "currency",
            "created_at",
            "updated_at",
            "stripe_payment_intent_id",
            "stripe_payment_id",
            "items",
        ]
        read_only_fields = [
            "user",                       
            "total_amount",               
            "currency",                   
            "created_at",
            "updated_at",
            "stripe_payment_intent_id",
            "stripe_payment_id",
            "items",
        ]


class AdminOrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]
    
    def validate_status(self, value):
        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Invalid status. Must be one of: {valid_statuses}")
        return value   