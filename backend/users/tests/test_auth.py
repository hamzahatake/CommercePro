import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_customer_can_register_and_login():
    client = APIClient()

    # Register
    response = client.post("/api/auth/register/", {
        "username": "john",
        "email": "john@example.com",
        "password": "pass1234"
    })
    assert response.status_code == 201

    # Login
    response = client.post("/api/auth/login/", {
        "username": "john",
        "password": "pass1234"
    })
    assert "access" in response.data
