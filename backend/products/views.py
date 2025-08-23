from django.core.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet
from .serializers import ProductSerializer
from .models import Product

class ProductView(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        if request.user.role == "vendor" and request.user.vendorprofile.approval_status != "approved":
            raise ValidationError("Vendor is not approved yet!")
        
        return super().create(request, *args, **kwargs)
