import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from products.models import Product, Category   # 👈 make sure Category is imported
from users.models import VendorProfile

User = get_user_model()

@pytest.mark.django_db
def test_customer_can_add_and_remove_wishlist_item():
    # Create a customer
    customer = User.objects.create_user(
        username="cust",
        email="cust@test.com",
        password="pass1234",
        role="customer"
    )

    # Create a vendor user
    vendor_user = User.objects.create_user(
        username="vendor",
        email="vendor@test.com",
        password="pass1234",
        role="vendor",
        is_active=True
    )
    VendorProfile.objects.create(
        user=vendor_user,
        business_name="Tech Store"
    )

    # Create category
    category = Category.objects.create(name="Electronics")

    # Create product tied to vendor + category
    product = Product.objects.create(
        vendor=vendor_user,   # FK to User
        title="Laptop",
        description="Test laptop",
        price=999,
        stock=5,
        category=category     # FK to Category
    )

    client = APIClient()
    client.force_authenticate(user=customer)

    # Add to wishlist
    response = client.post("/api/wishlist/add/", {"product_id": product.id})
    assert response.status_code == 200
    assert product.id in response.data["products"]

    # Try adding again (duplicate)
    response = client.post("/api/wishlist/add/", {"product_id": product.id})
    assert response.status_code in [200, 400]

    # Remove from wishlist
    response = client.delete(f"/api/wishlist/remove/?product_id={product.id}")
    assert response.status_code == 200
    assert product.id not in response.data["products"]
