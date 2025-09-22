from django.urls import path
from .views import (
    ListAllWishlistViews, 
    AddToWishlistViews, 
    DeleteFromWishlistViews,
    CheckWishlistStatusView,
    BulkWishlistOperationsView,
    ClearWishlistView
)

urlpatterns = [
    path('', ListAllWishlistViews.as_view(), name="wishlist-list"),
    path('add/', AddToWishlistViews.as_view(), name="wishlist-add"),
    path('remove/<int:product_id>/', DeleteFromWishlistViews.as_view(), name="wishlist-remove"),
    path('check/<int:product_id>/', CheckWishlistStatusView.as_view(), name="wishlist-check"),
    path('bulk/', BulkWishlistOperationsView.as_view(), name="wishlist-bulk"),
    path('clear/', ClearWishlistView.as_view(), name="wishlist-clear"),
]
