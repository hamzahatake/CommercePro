import pytest
from products.models import Product

@pytest.mark.django_db
def test_product_stock_reduces_correctly():
    from django.contrib.auth import get_user_model
    User = get_user_model()
    user = User.objects.create_user(username="test", email="test@test.com", password="testpass")
    product = Product.objects.create(title="Test", price=100, stock=10, vendor=user)
    product.stock -= 2
    product.save()
    assert product.stock == 8
