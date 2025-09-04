import pytest
from products.models import Product

@pytest.mark.django_db
def test_product_stock_reduces_correctly():
    product = Product.objects.create(title="Test", price=100, stock=10)
    product.stock -= 2
    product.save()
    assert product.stock == 8
