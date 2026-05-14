from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.addresses.models import Address
from apps.products.models import ProductVariant


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING_PAYMENT = "pending_payment", "Chờ thanh toán"
        PAID = "paid", "Đã thanh toán"
        PROCESSING = "processing", "Đang xử lý"
        SHIPPING = "shipping", "Đang giao hàng"
        COMPLETED = "completed", "Đã giao hàng"
        CANCELLED = "cancelled", "Đã hủy"

    class PaymentMethod(models.TextChoices):
        VIETQR = "vietqr", "VIETQR"
        BANK = "bank", "Chuyển khoản ngân hàng"
        ATM = "atm", "Thẻ ATM nội địa / Napas"
        VISA = "visa", "Visa / Mastercard"
        COD = "cod", "Thanh toán khi nhận hàng"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    code = models.CharField(max_length=20, unique=True, editable=False)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING_PAYMENT)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    payment_status = models.CharField(max_length=30, default="pending")
    total_amount = models.DecimalField(max_digits=14, decimal_places=0, default=0)

    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")
    receiver_name = models.CharField(max_length=150)
    receiver_phone = models.CharField(max_length=20)
    receiver_address = models.TextField()

    bank_name = models.CharField(max_length=120, default="VIETCOMBANK - CN Hồ Chí Minh")
    bank_account_number = models.CharField(max_length=40, default="007 100 125 1585")
    bank_account_name = models.CharField(max_length=180, default="CÔNG TY TNHH FUJIFILM VIỆT NAM")
    transfer_content = models.CharField(max_length=80, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Đơn hàng"
        verbose_name_plural = "Đơn hàng"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.code:
            timestamp = timezone.now().strftime("%y%m%d%H%M%S")
            self.code = f"DH{timestamp}"
        if not self.transfer_content:
            self.transfer_content = self.code
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} - {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    product_id = models.PositiveIntegerField()
    product_name = models.CharField(max_length=200)
    variant_name = models.CharField(max_length=100)
    product_image = models.URLField(blank=True, default="")
    unit_price = models.DecimalField(max_digits=14, decimal_places=0)
    quantity = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=14, decimal_places=0)

    class Meta:
        verbose_name = "Sản phẩm trong đơn"
        verbose_name_plural = "Sản phẩm trong đơn"

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"
