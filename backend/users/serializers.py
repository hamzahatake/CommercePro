from rest_framework import serializers
from .models import User, VendorProfile, EmailVerificationToken, PasswordResetToken
from django.contrib.auth import get_user_model, authenticate
from rest_framework.validators import ValidationError
from .models import User, CustomerProfile, VendorProfile, ManagerProfile, AdminProfile
from core.serializers.base import BaseUserSerializer
from django.contrib.auth.password_validation import validate_password
from django.utils.crypto import get_random_string
from .emails import send_verification_email, send_password_reset_email
from .tasks import send_verification_email_task, send_password_reset_email_task, send_welcome_email_task_new

User= get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "email"]


class UserRegistrationSerializer(BaseUserSerializer):
    role = serializers.ChoiceField(choices=User.Roles.choices, default=User.Roles.CUSTOMER)
    
    class Meta:
        model = User
        fields = BaseUserSerializer.Meta.fields + ['role']


class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CustomerProfile
        fields = [
            "id", "user", "profile_picture", "phone_number", "shipping_address", 
            "billing_address", "preferred_payment_method"
        ]
        read_only_fields = ["id"]
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.profile_picture:
            request = self.context.get('request')
            if request:
                data['profile_picture'] = request.build_absolute_uri(instance.profile_picture.url)
            else:
                data['profile_picture'] = instance.profile_picture.url
        return data


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
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.shop_logo:
            request = self.context.get('request')
            if request:
                data['shop_logo'] = request.build_absolute_uri(instance.shop_logo.url)
            else:
                data['shop_logo'] = instance.shop_logo.url
        return data


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


# Authentication Serializers
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm', 'role']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            role=validated_data.get('role', 'customer'),
            is_active=True  # Auto-activate users
        )
        
        # Send welcome email to new user
        from .tasks import send_welcome_email_task_new
        send_welcome_email_task_new.delay(user.id)
        
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials.')
            if not user.is_active:
                raise serializers.ValidationError('Please verify your email before logging in.')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password.')


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
            return value
        except User.DoesNotExist:
            return value
    
    def save(self):
        email = self.validated_data['email']
        try:
            user = User.objects.get(email=email)
            send_password_reset_email_task.delay(user.id)
        except User.DoesNotExist:
            pass


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def validate_token(self, value):
        try:
            token = PasswordResetToken.objects.get(token=value)
            if token.is_used:
                raise serializers.ValidationError("This reset link has already been used.")
            if token.is_expired():
                raise serializers.ValidationError("This reset link has expired.")
            return value
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid reset link.")
    
    def save(self):
        token = self.validated_data['token']
        new_password = self.validated_data['new_password']
        
        reset_token = PasswordResetToken.objects.get(token=token)
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        reset_token.use_token()
        
        return user


class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField()
    
    def validate_token(self, value):
        try:
            token = EmailVerificationToken.objects.get(token=value)
            if token.is_used:
                raise serializers.ValidationError("This verification link has already been used.")
            if token.is_expired():
                raise serializers.ValidationError("This verification link has expired.")
            return value
        except EmailVerificationToken.DoesNotExist:
            raise serializers.ValidationError("Invalid verification link.")
    
    def save(self):
        token = self.validated_data['token']
        verification_token = EmailVerificationToken.objects.get(token=token)
        verification_token.use_token()
        
        # Send welcome email
        send_welcome_email_task_new.delay(verification_token.user.id)
        
        return verification_token.user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def save(self):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    shop_logo = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role', 'is_active', 'date_joined', 'profile_picture', 'shop_logo']
        read_only_fields = ['id', 'email', 'role', 'is_active', 'date_joined']
    
    def get_profile_picture(self, obj):
        if obj.role == 'customer' and hasattr(obj, 'customer_profile'):
            if obj.customer_profile.profile_picture:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.customer_profile.profile_picture.url)
                return obj.customer_profile.profile_picture.url
        return None
    
    def get_shop_logo(self, obj):
        if obj.role == 'vendor' and hasattr(obj, 'vendor_profile'):
            if obj.vendor_profile.shop_logo:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.vendor_profile.shop_logo.url)
                return obj.vendor_profile.shop_logo.url
        return None