from rest_framework import serializers
from .models import User, VendorProfile
from django.contrib.auth import get_user_model
from .models import User, CustomerProfile, VendorProfile, ManagerProfile, AdminProfile
from core.serializers.base import BaseUserSerializer

User= get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "email"]


class UserRegistrationSerializer(BaseUserSerializer):
    class Meta:
        model = User


class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CustomerProfile
        fields = [
            "id", "user", "phone_number", "shipping_address", 
            "billing_address", "preferred_payment_method"
        ]
        read_only_fields = ["id"]


class CustomerRegistrationSerializer(BaseUserSerializer):
    phone_number = serializers.IntegerField()
    shipping_address = serializers.CharField()
    billing_address = serializers.CharField()
    preferred_payment_method = serializers.CharField()

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + [
            "phone_number", "shipping_address", "billing_address", "preferred_payment_method"
        ]

    def create(self, validated_data):
        profile_data = {
            "phone_number": validated_data.pop("phone_number"),
            "shipping_address": validated_data.pop("shipping_address"),
            "billing_address": validated_data.pop("billing_address"),
            "preferred_payment_method": validated_data.pop("preferred_payment_method"),
        }

        user = super().create(validated_data)
        user.role = "customer"
        user.save()

        CustomerProfile.objects.create(user=user, **profile_data)
        return user


class VendorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = VendorProfile
        fields = [
            "id", "user", "shop_name", "shop_logo", "business_email",
            "phone_number", "address", "tax_id", "bank_name", 
            "account_number", "approved"
        ]
        read_only_fields = ["id", "approved"]


class VendorRegistrationSerializer(BaseUserSerializer):
    shop_name = serializers.CharField()
    shop_logo = serializers.ImageField(required=False)
    business_email = serializers.EmailField()
    phone_number = serializers.IntegerField()
    address = serializers.CharField()
    tax_id = serializers.IntegerField()
    bank_name = serializers.CharField()
    account_number = serializers.CharField()

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + [
            "shop_name", "shop_logo", "business_email", "phone_number",
            "address", "tax_id", "bank_name", "account_number"
        ]

    def create(self, validated_data):
        profile_data = {
            "shop_name": validated_data.pop("shop_name"),
            "shop_logo": validated_data.pop("shop_logo", None),
            "business_email": validated_data.pop("business_email"),
            "phone_number": validated_data.pop("phone_number"),
            "address": validated_data.pop("address"),
            "tax_id": validated_data.pop("tax_id"),
            "bank_name": validated_data.pop("bank_name"),
            "account_number": validated_data.pop("account_number"),
        }

        user = super().create(validated_data)
        user.role = "vendor"
        user.save()

        VendorProfile.objects.create(user=user, **profile_data)
        return user


class ManagerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assigned_vendors = VendorProfileSerializer(many=True, read_only=True)
    
    class Meta:
        model = ManagerProfile
        fields = [
            "id", "user", "department", "phone_number", 
            "permissions_level", "assigned_vendors"
        ]
        read_only_fields = ["id"]


class ManagerRegistrationSerializer(BaseUserSerializer):
    department = serializers.CharField()
    phone_number = serializers.IntegerField()

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + ["department", "phone_number"]

    def create(self, validated_data):
        profile_data = {
            "department": validated_data.pop("department"),
            "phone_number": validated_data.pop("phone_number"),
        }

        user = super().create(validated_data)
        user.role = "manager"
        user.save()

        ManagerProfile.objects.create(user=user, **profile_data)
        return user


class AdminProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = AdminProfile
        fields = ["id", "user", "access_level", "notes"]
        read_only_fields = ["id"]


class AdminRegistrationSerializer(BaseUserSerializer):
    notes = serializers.CharField(required=False)

    class Meta(BaseUserSerializer.Meta):
        fields = BaseUserSerializer.Meta.fields + ["notes"]

    def create(self, validated_data):
        profile_data = {"notes": validated_data.pop("notes", "")}

        user = super().create(validated_data)
        user.role = "admin"
        user.is_staff = True
        user.is_superuser = True
        user.save()

        AdminProfile.objects.create(user=user, **profile_data)
        return user