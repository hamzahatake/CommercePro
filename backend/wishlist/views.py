from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from .serializers import WishlistSerializers
from .models import Wishlist


class ListAllWishlistViews(generics.ListAPIView):
    serializer_class = WishlistSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)


class AddToWishlistViews(generics.CreateAPIView):
    serializer_class = WishlistSerializers
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validate_data.get("product")

        if Wishlist.objects.filter(user=user, product=product).exist():
            raise ValidationError("This product is already in your wishlist.")

        count = Wishlist.objects.filter(user=user).count()
        if count >= 100:
            raise ValidationError("Wishlist limit reached!")
        serializer.save(user=user)


class DeleteFromWishlistViews(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistSerializers  

    lookup_field = "product_id"

    def get_object(self):
        product_id = self.kwargs.get(self.lookup_field)
        return Wishlist.objects.get(user=self.request.user, product_id=product_id)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return ResourceWarning({"message": "Remove from wishlist"}, status=status.HTTP_204_NO_CONTENT)