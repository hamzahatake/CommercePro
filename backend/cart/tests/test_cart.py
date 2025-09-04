import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()

@pytest.mark.django_db
def test_customer_adds_item_to_cart():
    customer = User.objects.create_user("cust", "cust@test.com", "pass1234", role="customer")
    product = Product.objects.create(title="Shoes", price=50, stock=5)
    
    client = APIClient()
    client.force_authenticate(user=customer)

    response = client.post("/api/cart/add/", {"product_id": product.id, "quantity": 2})

    assert response.status_code == 200
    assert response.data["total"] == "100.00"   # cart total
