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
    AdminProfileRetrieveUpdateAPIView,
    
    # Authentication views
    UserRegistrationView,
    UserLoginView,
    UserLogoutView,
    EmailVerificationView,
    PasswordResetView,
    PasswordResetConfirmView,
    UserProfileView,
    ChangePasswordView,
    ResendVerificationEmailView
)

urlpatterns = [
    # Legacy profile registration endpoints
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
    
    # Authentication endpoints
    path("auth/register/", UserRegistrationView.as_view(), name="auth-register"),
    path("auth/login/", UserLoginView.as_view(), name="auth-login"),
    path("auth/logout/", UserLogoutView.as_view(), name="auth-logout"),
    path("auth/verify-email/<str:token>/", EmailVerificationView.as_view(), name="auth-verify-email"),
    path("auth/password-reset/", PasswordResetView.as_view(), name="auth-password-reset"),
    path("auth/password-reset/confirm/<str:token>/", PasswordResetConfirmView.as_view(), name="auth-password-reset-confirm"),
    path("auth/profile/", UserProfileView.as_view(), name="auth-profile"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="auth-change-password"),
    path("auth/resend-verification/", ResendVerificationEmailView.as_view(), name="auth-resend-verification"),
]
