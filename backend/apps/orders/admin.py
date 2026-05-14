from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["product_id", "product_name", "variant_name", "unit_price", "quantity", "subtotal"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["code", "user", "payment_method", "payment_status", "status", "total_amount", "created_at"]
    list_filter = ["status", "payment_method", "payment_status"]
    search_fields = ["code", "user__email", "receiver_name", "receiver_phone"]
    readonly_fields = ["code", "created_at", "updated_at"]
    inlines = [OrderItemInline]
