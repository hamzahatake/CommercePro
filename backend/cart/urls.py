from django.urls import path
from .views import CartRetrieveAPIView, AddtoCartAPIView, UpdateCartItemAPIView, RemoveFromCartAPIView

urlpatterns = [
    path("cart/", CartRetrieveAPIView.as_view(), name="cart-detail"),
    path("cart/add/", AddtoCartAPIView.as_view(), name="cart-add"),
    path("cart/update/<int:pk>/", UpdateCartItemAPIView.as_view(), name="cart-update"),
    path("cart/remove/<int:pk>/", RemoveFromCartAPIView.as_view(), name="cart-remove"),
]
