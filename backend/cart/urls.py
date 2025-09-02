from django.urls import path
from .views import CartRetrieveAPIView, AddtoCartAPIView, UpdateCartItemAPIView, RemoveFromCartAPIView

urlpatterns = [
    path("", CartRetrieveAPIView.as_view(), name="cart-detail"),
    path("add/", AddtoCartAPIView.as_view(), name="cart-add"),
    path("update/<int:pk>/", UpdateCartItemAPIView.as_view(), name="cart-update"),
    path("remove/<int:pk>/", RemoveFromCartAPIView.as_view(), name="cart-remove"),
]
