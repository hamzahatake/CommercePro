import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from users.models import VendorProfile 
from products.models import Product

User = get_user_model()


@pytest.mark.django_db
def test_vendor_can_create_product():
    # 1. Create a vendor user
    vendor_user = User.objects.create_user(
        username="vendor",
        email="vendor@test.com",
        password="pass1234",
        role="vendor",
        is_active=True
    )

    # 2. Create a VendorProfile linked to the user
    vendor_profile = VendorProfile.objects.create(
        user=vendor_user,
        business_name="Test Vendor"
    )

    # 3. Authenticate API client as this vendor
    client = APIClient()
    client.force_authenticate(user=vendor_user)

    # 4. Post a new product (include required fields)
    response = client.post("/api/vendor/products/", {
        "title": "T-Shirt",
        "price": "19.99",
        "stock": 10,
        "description": "Cool tee",
        "category": "Clothing"
    }, format="json")

    # 5. Assertions
    assert response.status_code == 201, response.data
    assert Product.objects.filter(title="T-Shirt", vendor=vendor_profile).exists()
