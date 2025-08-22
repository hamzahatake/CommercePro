from django.urls import path
from .views import VendorProfileView

url_patterns = [
    path('api/vendor/', VendorProfileView.as_view(), name="all_vendor_profiles"),
    path('api/vendor/<int:id>/', VendorProfileView.as_view(), name="vendor_profile_by_id")
]