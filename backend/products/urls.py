from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VendorProductViewSet,
    ProductListView,
    ProductDetailView,
    CategoryListView,
    ProductVariantViewSet,
)

router = DefaultRouter()
router.register(r'vendor/products', VendorProductViewSet, basename='vendor-products')
router.register(r'vendor/variants', ProductVariantViewSet, basename='product-variants')

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    # Vendor endpoints (router-based)
    path("", include(router.urls)),
]
