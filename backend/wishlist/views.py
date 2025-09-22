from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .serializers import WishlistSerializer
from .models import Wishlist
from products.models import Product


class ListAllWishlistViews(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related('product')


class AddToWishlistViews(generics.CreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data.get("product")

        if Wishlist.objects.filter(user=user, product=product).exists():
            raise ValidationError("This product is already in your wishlist.")

        count = Wishlist.objects.filter(user=user).count()
        if count >= 100:
            raise ValidationError("Wishlist limit reached!")
        serializer.save(user=user)


class DeleteFromWishlistViews(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistSerializer  

    lookup_field = "product_id"

    def get_object(self):
        product_id = self.kwargs.get(self.lookup_field)
        return get_object_or_404(Wishlist, user=self.request.user, product_id=product_id)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Item removed from wishlist"}, status=status.HTTP_200_OK)


class CheckWishlistStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        """Check if a product is in the user's wishlist"""
        try:
            product = get_object_or_404(Product, id=product_id, is_active=True)
            is_in_wishlist = Wishlist.objects.filter(
                user=request.user, 
                product=product
            ).exists()
            
            return Response({
                "product_id": product_id,
                "is_in_wishlist": is_in_wishlist
            })
        except Exception as e:
            return Response(
                {"error": "Invalid product ID"}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class BulkWishlistOperationsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Add multiple products to wishlist"""
        product_ids = request.data.get('product_ids', [])
        if not product_ids:
            return Response(
                {"error": "No product IDs provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user has reached wishlist limit
        current_count = Wishlist.objects.filter(user=request.user).count()
        if current_count + len(product_ids) > 100:
            return Response(
                {"error": "Adding these products would exceed wishlist limit of 100"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        added_products = []
        already_in_wishlist = []
        invalid_products = []

        for product_id in product_ids:
            try:
                product = Product.objects.get(id=product_id, is_active=True)
                
                if Wishlist.objects.filter(user=request.user, product=product).exists():
                    already_in_wishlist.append(product_id)
                else:
                    Wishlist.objects.create(user=request.user, product=product)
                    added_products.append(product_id)
                    
            except Product.DoesNotExist:
                invalid_products.append(product_id)

        return Response({
            "added_products": added_products,
            "already_in_wishlist": already_in_wishlist,
            "invalid_products": invalid_products,
            "message": f"Added {len(added_products)} products to wishlist"
        })

    def delete(self, request):
        """Remove multiple products from wishlist"""
        product_ids = request.data.get('product_ids', [])
        if not product_ids:
            return Response(
                {"error": "No product IDs provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        removed_count = Wishlist.objects.filter(
            user=request.user, 
            product_id__in=product_ids
        ).delete()[0]

        return Response({
            "removed_count": removed_count,
            "message": f"Removed {removed_count} products from wishlist"
        })


class ClearWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """Clear entire wishlist"""
        count = Wishlist.objects.filter(user=request.user).count()
        Wishlist.objects.filter(user=request.user).delete()
        
        return Response({
            "removed_count": count,
            "message": f"Cleared {count} items from wishlist"
        })