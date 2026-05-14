from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "username", "first_name", "last_name", "phone", "is_staff", "is_active"]
    list_filter = ["is_staff", "is_active"]
    search_fields = ["email", "username", "phone"]
    ordering = ["-date_joined"]

    # Thêm field phone vào form chỉnh sửa
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Thông tin thêm", {"fields": ("phone",)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Thông tin thêm", {"fields": ("email", "phone")}),
    )
