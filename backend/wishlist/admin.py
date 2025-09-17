from django.contrib import admin
from .models import Wishlist

@admin.register(Wishlist)
class Wishlist(admin.ModelAdmin):
    list_display = ["user", "product", "created_at"]
    search_fields = ["user__username", "product__title"]
