from django.db import models
from django.contrib.auth.models import AbstractUser
from .validators import validate_image_size
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):
    class Roles(models.TextChoices): 
        CUSTOMER = "customer", "Customer"
        VENDOR = "vendor", "Vendor"
        MANAGER = "manager", "Manager"
        ADMIN = "admin", "Admin"

    role = models.CharField(max_length=255, choices=Roles.choices, null=False, blank=False, default=Roles.CUSTOMER)
    
    # Override email field to make it unique and required
    email = models.EmailField(unique=True, blank=False, null=False)
    
    # Use email as the username field for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email
    

class CustomerProfile(models.Model):
    class PaymentMethods(models.TextChoices):
        COD = "cash_on_delivery", "CashOnDelivery"
        STRIPE = "stripe", "Stripe"
        PAYPAL = "paypal", "Paypal"
        AMAZONPAY = "amazonpay", "AmazonPay"


    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="customer_profile")
    profile_picture = models.ImageField(upload_to='media/profile_pictures/', validators=[validate_image_size], null=True, blank=True)
    phone_number = models.IntegerField(unique=True, blank=True, null=True)
    shipping_address = models.CharField(max_length=255, blank=True, null=True)
    billing_address = models.CharField(max_length=255, blank=True, null=True)
    preferred_payment_method = models.CharField(max_length=255, choices=PaymentMethods.choices, blank=True, null=True, default=PaymentMethods.COD)

    def __str__(self):
        return f"{self.user.first_name} {self.phone_number} {self.shipping_address}"

class VendorProfile(models.Model):
    class Banks(models.TextChoices):
        HBL = "HBL", "Habib Bank Limited"
        MCB = "MCB", "Muslim Commercial Bank"
        UBL = "UBL", "United Bank Limited"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="vendor_profile")
    shop_name = models.CharField(max_length=255, unique=True, blank=True, null=True)
    shop_logo = models.ImageField(upload_to='media/shop_logo/', validators=[validate_image_size], null=True, blank=True)
    business_email = models.EmailField(unique=True, blank=True, null=True)
    phone_number = models.IntegerField(unique=True, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    tax_id = models.IntegerField(unique=True, blank=True, null=True)
    bank_name = models.CharField(choices=Banks.choices, blank=True, null=True)
    account_number = models.IntegerField(unique=True, blank=True, null=True)
    approved = models.BooleanField(default=False)


class ManagerProfile(models.Model):
    class Departments(models.TextChoices):
        SALES = "sales", "Sales"
        SUPPORT = "support", "Support"
        OPERATIONS = "operations", "Operations"
    
    class Permissions_Levels(models.TextChoices):
        BASIC = "basic", "BASIC"
        SENIOR = "senior_manager", "SeniorManager"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="manager_profile")
    department = models.CharField(max_length=255, choices=Departments.choices, blank=True, null=True, default=Departments.SALES)
    phone_number = models.IntegerField(unique=True, blank=True, null=True)
    permissions_level = models.CharField(max_length=255, choices=Permissions_Levels.choices, blank=True, null=True, default=Permissions_Levels.BASIC)
    assigned_vendors = models.ManyToManyField(VendorProfile, blank=True, related_name="assigned_vendors")


class AdminProfile(models.Model):
    class AccessLevel(models.TextChoices):
        ADMIN = "admin", "Admin"
        SUPER_ADMIN = "super_admin", "SuperAdmin"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="admin_profile")
    access_level = models.CharField(choices=AccessLevel.choices, blank=True, null=True, default=AccessLevel.ADMIN)
    notes = models.TextField(blank=True, null=True)


class EmailVerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="email_verification_tokens")
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Email verification for {self.user.email}"
    
    def is_expired(self):
        """Check if token is older than 24 hours"""
        return timezone.now() > self.created_at + timedelta(hours=24)
    
    def use_token(self):
        """Mark token as used and activate user"""
        self.is_used = True
        self.user.is_active = True
        self.user.save()
        self.save()


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="password_reset_tokens")
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Password reset for {self.user.email}"
    
    def is_expired(self):
        """Check if token is older than 1 hour"""
        return timezone.now() > self.created_at + timedelta(hours=1)
    
    def use_token(self):
        """Mark token as used"""
        self.is_used = True
        self.save()