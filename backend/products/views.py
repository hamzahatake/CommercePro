from rest_framework import viewsets, generics, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Product, Category
from .serializers import ProductSerializer, ProductPublicSerializer, CategorySerializer
from .permissions import IsVendorOrAdmin
from django_filters.rest_framework import DjangoFilterBackend

class VendorProductViewSet(viewsets.ModelViewSet):
    """ViewSet for vendors to manage their products"""
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsVendorOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return Product.objects.all()
        if user.role == 'vendor':
            return Product.objects.filter(vendor=user)
        return Product.objects.none()

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

class ProductListView(generics.ListAPIView):
    """Public view for customers to browse products"""
    serializer_class = ProductPublicSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['category']
    
    search_fields = ['title', 'description']
    
    ordering_fields = ['price', 'stock', 'created_at']
    ordering = ['-created_at']

class ProductDetailView(generics.RetrieveAPIView):
    """Public view for customers to view individual product details"""
    serializer_class = ProductPublicSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(is_active=True)
    lookup_field = 'slug'

class CategoryListView(generics.ListAPIView):
    """Public view to list all categories"""
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()  