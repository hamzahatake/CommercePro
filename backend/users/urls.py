from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    VendorRegisterView,
    UserRegistrationView,
    CustomTokenObtainPairView,
    AdminVendorViewSet,
    UserProfileView,
    VendorProfileView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("users/auth/register/", UserRegistrationView.as_view(), name="customer-register"),
    path("users/auth/vendor-register/", VendorRegisterView.as_view(), name="vendor-register"),
    path("users/auth/login/", CustomTokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("users/auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("users/profile/", UserProfileView.as_view(), name="user-profile"),
]

router = DefaultRouter()

# Approve/reject actions are automatically available as PATCH:
#   /admin/vendors/{id}/approve/
#   /admin/vendors/{id}/reject/
router.register("admin/vendors", AdminVendorViewSet, basename="admin-vendors")

router.register("vendor-profiles", VendorProfileView, basename="vendor-profiles")

urlpatterns += router.urls
