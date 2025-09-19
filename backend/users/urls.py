from django.urls import path
from .views import (
    UserProfileRegistrationView,
    UserProfileRetrieveUpdateAPIView,
    CustomerProfileRegistrationView,
    CustomerProfileRetrieveUpdateAPIView,
    VendorProfileRegistrationView,
    VendorProfileRetrieveUpdateAPIView,
    ManagerProfileRegistrationView,
    ManagerProfileRetrieveUpdateAPIView,
    AdminProfileRegistrationView,
    AdminProfileRetrieveUpdateAPIView
)

urlpatterns = [
    path("users/api/register/user/", UserProfileRegistrationView.as_view(), name="user-register"),
    path("users/api/profile/user/", UserProfileRetrieveUpdateAPIView.as_view(), name="user-profile"),
    path("users/api/register/customer/", CustomerProfileRegistrationView.as_view(), name="customer-register"),
    path("users/api/profile/customer/", CustomerProfileRetrieveUpdateAPIView.as_view(), name="customer-profile"),
    path("users/api/register/vendor/", VendorProfileRegistrationView.as_view(), name="vendor-register"),
    path("users/api/profile/vendor/", VendorProfileRetrieveUpdateAPIView.as_view(), name="vendor-profile"),
    path("users/api/register/manager/", ManagerProfileRegistrationView.as_view(), name="manager-register"),
    path("users/api/profile/manager/", ManagerProfileRetrieveUpdateAPIView.as_view(), name="manager-profile"),
    path("users/api/register/admin/", AdminProfileRegistrationView.as_view(), name="admin-register"),
    path("users/api/profile/admin/", AdminProfileRetrieveUpdateAPIView.as_view(), name="admin-profile"),
]
