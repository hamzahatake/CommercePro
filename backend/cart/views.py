from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartItemSerializer, CartSerializer
from products.models import Product

def get_cart_user(user):
    cart, created = Cart.objects.get_or_create(user=user)
    return cart

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_cart_user(request.user)
        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)


class CartRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_cart_user(self.request.user) 


class AddtoCartAPIView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        cart_user = get_cart_user(self.request.user)
        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))

        products = get_object_or_404(Product, is_active=True, id=product_id)

        if quantity > products.stock:
            return Response({"error": "Not enough stock"}, status=status.HTTP_400_BAD_REQUEST)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart_user,
            product=products,
            defaults={"quantity":quantity}
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > products.stock:
                return Response({"error": "Exceeds stock"}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = new_quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item, context={"request": request})

        cart_serializer = CartSerializer(cart_user, context={"request": request})
        return Response({
            "item": serializer.data,
            "cart": cart_serializer.data
        }, status=status.HTTP_201_CREATED)
    

class UpdateCartItemAPIView(generics.UpdateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    queryset = CartItem.objects.all()

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def update(self, request, *args, **kwargs):
        cart_item = self.get_object()

        quantity = int(request.data.get("quantity", 1))
        if quantity > cart_item.product.stock:
            return Response({"error": "Exceeds stock"}, status=status.HTTP_400_BAD_REQUEST)
        
        if quantity < 1:
            cart_item.delete()
            return Response({"message": "Item removed"}, status=status.HTTP_204_NO_CONTENT)
    
        cart_item.quantity = quantity
        cart_item.save()

        cart_serializer = CartSerializer(cart_item.cart, context={"request": request})
        return Response(cart_serializer.data)


class RemoveFromCartAPIView(generics.DestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    queryset = CartItem.objects.all()

    def perform_destroy(self, instance):

        if instance.cart.user != self.request.user:
            return Response({"error": "Not your cart"}, status=status.HTTP_403_FORBIDDEN)
        
        cart = instance.cart
        instance.delete()

        cart_serializer = CartSerializer(cart, context={"request": self.request})
        return Response(cart_serializer.data, status=status.HTTP_204_NO_CONTENT)



