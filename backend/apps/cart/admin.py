from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ["subtotal"]


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["user", "item_count", "total", "updated_at"]
    search_fields = ["user__email"]
    raw_id_fields = ["user"]
    inlines = [CartItemInline]

    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = "Số sản phẩm"


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["cart", "variant", "quantity", "subtotal"]
    search_fields = ["cart__user__email", "variant__product__name"]
