from django.http import Http404
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer, 
    CustomerProfileSerializer,
    CustomerRegistrationSerializer,
    VendorProfileSerializer, 
    VendorRegistrationSerializer,
    ManagerProfileSerializer, 
    ManagerRegistrationSerializer, 
    AdminProfileSerializer,
    AdminRegistrationSerializer
    )
from .models import User, CustomerProfile, VendorProfile, ManagerProfile, AdminProfile
from django.utils import timezone
from django.db import transaction


class UserProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer


class UserProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class CustomerProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CustomerRegistrationSerializer

    @transaction.atomic()
    def perform_create(self, serializer):
        customer = serializer.save()
        return customer


class CustomerProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomerProfileSerializer

    def get_object(self):
        try:
            return self.request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            raise Http404("Profile not found!")


class VendorProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = VendorRegistrationSerializer

    @transaction.atomic()
    def perform_create(self, serializer):
        vendor = serializer.save()
        return vendor
        

class VendorProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VendorProfileSerializer

    def get_object(self):
        try:
            return self.request.user.vendor_profile
        except VendorProfile.DoesNotExist:
            raise Http404("Profile not found!")


class ManagerProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ManagerRegistrationSerializer

    @transaction.atomic()
    def perform_create(self, serializer):
        manager = serializer.save()
        return manager
    

class ManagerProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManagerProfileSerializer

    def get_object(self):
        try:
            return self.request.user.manager_profile
        except ManagerProfile.DoesNotExist:
            raise Http404("Profile not found!")


class AdminProfileRegistrationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = AdminRegistrationSerializer

    @transaction.atomic()
    def perform_create(self, serializer):
        admin = serializer.save()
        return admin


class AdminProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AdminProfileSerializer

    def get_object(self):
        try:
            return self.request.user.admin_profile
        except AdminProfile.DoesNotExist:
            raise Http404("Profile not found!")