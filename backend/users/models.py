from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Sum
from django.apps import apps
from .validators import validate_image_size, validate_document_size, validate_document_type
from django.core.validators import FileExtensionValidator

class User(AbstractUser):
    Role_Choices = [
        ("customer", "Customer"),
        ("vendor", "Vendor"),
        ("admin", "Admin")
    ]

    role = models.CharField(max_length=20, choices=Role_Choices, blank=False, default="customer")

    @property
    def is_customer(self):
        return self.role == "customer"
    @property
    def is_vendor(self):
        return self.role == "vendor"
    @property
    def is_admin(self):
        return self.role == "admin"


class VendorProfile(models.Model):
    approval_stat = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("suspended", "Suspended")
    ]
        
    allowed_types = [
    "application/pdf",
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="vendor_profile")

    business_name = models.CharField(max_length=255, unique=True, default="Unknown Business")
    legal_name = models.CharField(max_length=255, blank=False, default="Unknown Vendor")
    email = models.EmailField(db_index=True, null=True, blank=True)
    logo = models.ImageField(upload_to='vendor_logos/', validators=[
        validate_image_size, 
        FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"])
        ],
        blank=True, null=True)
    business_document = models.FileField(upload_to='business_docs/', validators=[
        validate_document_size, validate_document_type], 
        blank=True, null=True)
    approval_status = models.CharField(max_length=20, choices=approval_stat, default="pending")
    approved_at = models.DateTimeField(null=True)
    approved_by = models.ForeignKey(
        User, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL, 
        limit_choices_to={"role": "admin"},
        related_name="approved_vendors"
    )

    def __str__(self):
        return self.business_name

    @property
    def is_approved(self):
        return self.approved_at is not None

    @property
    def sales(self):
        OrderItem = apps.get_model('orders', 'OrderItem')
        result = (OrderItem.objects
            .filter(product__vendor=self.user, order__status="paid")
            .aggregate(total=Sum("unit_price")))
        
        return result['total'] or 0