from rest_framework import viewsets, generics, filters, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from rest_framework.pagination import PageNumberPagination

from .models import Product, Category, ProductVariant, ProductSize, ProductImage
from .serializers import (
    ProductSerializer,
    ProductPublicSerializer,
    CategorySerializer,
    ProductVariantSerializer,
    ProductSizeSerializer,
    ProductImageSerializer,
)
from .permissions import IsVendorOrAdmin


class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class ProductFilter(FilterSet):
    category = CharFilter(field_name="category__slug", lookup_expr="iexact")

    class Meta:
        model = Product
        fields = ["category"]


class VendorProductViewSet(viewsets.ModelViewSet):
    """Vendors/Admins manage their own products"""
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsVendorOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == "admin":
            return Product.objects.all()
        if user.role == "vendor":
            return Product.objects.filter(vendor=user)
        return Product.objects.none()

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    def create(self, request, *args, **kwargs):
        # Handle variants data from JSON string
        if 'variants' in request.data and isinstance(request.data['variants'], str):
            try:
                import json
                request.data['variants'] = json.loads(request.data['variants'])
            except json.JSONDecodeError:
                return Response({'variants': 'Invalid JSON format'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the product with variants
        product = serializer.save()
        
        # Handle image uploads for variants
        for variant_index, variant in enumerate(product.variants.all()):
            variant_images = []
            for key, value in request.FILES.items():
                if key.startswith(f'variant_{variant_index}_image_'):
                    variant_images.append(value)
            
            for image_file in variant_images:
                ProductImage.objects.create(variant=variant, image=image_file)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class ProductListView(generics.ListAPIView):
    serializer_class = ProductPublicSerializer
    permission_classes = [AllowAny]
    pagination_class = ProductPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ["title", "description"]
    ordering_fields = ["base_price", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Product.objects.filter(is_active=True).prefetch_related(
            "variants__images", "variants__sizes"
        )


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductPublicSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return Product.objects.filter(is_active=True).prefetch_related(
            "variants__images", "variants__sizes", "media_sections__items"
        )


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()


class ProductVariantViewSet(viewsets.ModelViewSet):
    """Vendors/Admins manage product variants"""
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated, IsVendorOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == "admin":
            return ProductVariant.objects.all()
        if user.role == "vendor":
            return ProductVariant.objects.filter(product__vendor=user)
        return ProductVariant.objects.none()

    def perform_create(self, serializer):
        product_id = self.request.data.get("product")
        product = get_object_or_404(Product, id=product_id, vendor=self.request.user)
        serializer.save(product=product)


class ProductSizeViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSizeSerializer
    permission_classes = [IsAuthenticated, IsVendorOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == "admin":
            return ProductSize.objects.all()
        if user.role == "vendor":
            return ProductSize.objects.filter(variant__product__vendor=user)
        return ProductSize.objects.none()


class ProductImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated, IsVendorOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == "admin":
            return ProductImage.objects.all()
        if user.role == "vendor":
            return ProductImage.objects.filter(variant__product__vendor=user)
        return ProductImage.objects.none()
