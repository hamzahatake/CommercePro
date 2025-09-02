from rest_framework.routers import DefaultRouter
from .views import VendorProductViewSet, ProductListView, ProductDetailView, CategoryListView
from django.urls import path

router = DefaultRouter()
router.register(r'vendor/products', VendorProductViewSet, basename='vendor-products')

urlpatterns = router.urls

urlpatterns += [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
]