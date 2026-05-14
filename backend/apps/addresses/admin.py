from django.contrib import admin
from .models import Address


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["full_name", "phone", "address", "user", "is_default", "created_at"]
    list_filter = ["is_default"]
    search_fields = ["full_name", "phone", "user__email"]
    raw_id_fields = ["user"]
