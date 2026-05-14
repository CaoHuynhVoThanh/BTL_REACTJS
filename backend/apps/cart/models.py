from django.conf import settings
from django.db import models

from apps.products.models import ProductVariant


class Cart(models.Model):
    """Mỗi user có đúng 1 cart đang active."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Giỏ hàng"
        verbose_name_plural = "Giỏ hàng"

    def __str__(self):
        return f"Giỏ hàng của {self.user}"

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = "Mặt hàng trong giỏ"
        verbose_name_plural = "Mặt hàng trong giỏ"
        unique_together = [("cart", "variant")]  # Không trùng variant trong cùng giỏ

    def __str__(self):
        return f"{self.quantity}x {self.variant}"

    @property
    def subtotal(self):
        return self.variant.price * self.quantity
