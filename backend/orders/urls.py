from django.urls import path
from .views import (
    CheckoutAPIView, 
    OrderListAPIView, 
    CreatePaymentIntentAPIView,
    StripeWebhookView,
    OrderDetailAPIView,
    VendorOrderListAPIView,
    AdminOrderListAPIView,
    AdminOrderDetailAPIView,
)

urlpatterns = [
    path("create-payment-intent/", CreatePaymentIntentAPIView.as_view(), name="create-payment-intent"),
    path("stripe-webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),

    path("checkout/", CheckoutAPIView.as_view(), name="checkout"),

    path("", OrderListAPIView.as_view(), name="order-list"),
    path("<int:pk>/", OrderDetailAPIView.as_view(), name="order-detail"),

    path("vendor/orders/", VendorOrderListAPIView.as_view(), name="vendor-order-list"),

    path("admin/orders/", AdminOrderListAPIView.as_view(), name="admin-order-list"),
    path("admin/orders/<int:pk>/", AdminOrderDetailAPIView.as_view(), name="admin-order-detail"),
]
