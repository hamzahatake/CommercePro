from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CartSerializers, CartItemsSerializers
from .models import Cart, CartItems

class CartView(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializers


class CartItemView(viewsets.ModelViewSet):
    queryset = CartItems.objects.all()
    serializer_class = CartItemsSerializers