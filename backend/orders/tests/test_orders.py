import pytest
from unittest.mock import patch
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()

@pytest.mark.django_db
@patch("orders.views.stripe.PaymentIntent.create")
def test_order_created_after_payment(mock_payment_intent):
    mock_payment_intent.return_value = {"id": "pi_123", "client_secret": "secret_123"}
    
    customer = User.objects.create_user("cust", "cust@test.com", "pass1234", role="customer")
    product = Product.objects.create(title="Book", price=20, stock=3)
    
    client = APIClient()
    client.force_authenticate(user=customer)

    response = client.post("/api/orders/create/", {"product_id": product.id, "quantity": 1})
    assert response.status_code == 201
    assert response.data["status"] == "pending"
