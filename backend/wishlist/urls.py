from django.urls import path
from .views import ListAllWishlistViews, AddToWishlistViews, DeleteFromWishlistViews

urlpatterns = [
    path('', ListAllWishlistViews.as_view(), name="wishlist-list"),
    path('add/', AddToWishlistViews.as_view(), name="wishlist-add"),
    path('remove/<int:product_id>/', DeleteFromWishlistViews.as_view(), name="wishlist-remove"),
]
