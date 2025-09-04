import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_admin_can_approve_vendor():
    client = APIClient()

    # Create admin & vendor
    admin = User.objects.create_superuser("admin", "admin@test.com", "pass1234")
    vendor = User.objects.create_user("vendor", "vendor@test.com", "pass1234", role="vendor", is_active=False)

    # Admin login
    client.force_authenticate(user=admin)

    # Approve vendor
    response = client.patch(f"/api/admin/vendors/{vendor.id}/approve/")
    vendor.refresh_from_db()

    assert response.status_code == 200
    assert vendor.is_active is True
