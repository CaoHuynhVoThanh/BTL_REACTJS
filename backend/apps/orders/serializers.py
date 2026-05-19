from django.db import transaction
from django.db.models import F
from rest_framework import serializers

from apps.addresses.models import Address
from apps.cart.models import CartItem
from apps.products.models import ProductVariant
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id", "product_id", "product_name", "variant_name", "product_image",
            "unit_price", "quantity", "subtotal",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_method_display = serializers.CharField(source="get_payment_method_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "code", "status", "status_display", "payment_method", "payment_method_display",
            "payment_status", "total_amount", "receiver_name", "receiver_phone", "receiver_address",
            "bank_name", "bank_account_number", "bank_account_name", "transfer_content",
            "items", "created_at", "updated_at",
        ]


class CheckoutSerializer(serializers.Serializer):
    cart_item_ids = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)
    address_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices)

    def validate_address_id(self, value):
        request = self.context["request"]
        if not Address.objects.filter(pk=value, user=request.user).exists():
            raise serializers.ValidationError("Địa chỉ nhận hàng không hợp lệ.")
        return value

    def validate_cart_item_ids(self, value):
        request = self.context["request"]
        found = CartItem.objects.filter(pk__in=value, cart__user=request.user).count()
        if found != len(set(value)):
            raise serializers.ValidationError("Một hoặc nhiều sản phẩm trong giỏ không hợp lệ.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        address = Address.objects.get(pk=validated_data["address_id"], user=request.user)
        cart_items = list(
            CartItem.objects
            .select_for_update()
            .select_related("variant", "variant__product")
            .filter(pk__in=validated_data["cart_item_ids"], cart__user=request.user)
        )
        variant_ids = [item.variant_id for item in cart_items]
        locked_variants = {
            variant.id: variant
            for variant in ProductVariant.objects.select_for_update().filter(pk__in=variant_ids).order_by("pk")
        }

        stock_errors = []
        for item in cart_items:
            variant = locked_variants.get(item.variant_id)
            if not variant:
                stock_errors.append(f"{item.variant.name}: Sản phẩm không còn tồn tại.")
                continue

            item.variant = variant
            if item.quantity > variant.stock:
                stock_errors.append(
                    f"{variant.product.name} - {variant.name}: chỉ còn {variant.stock} sản phẩm."
                )

        if stock_errors:
            raise serializers.ValidationError({"detail": "Không đủ hàng trong kho.", "items": stock_errors})

        total = sum(item.subtotal for item in cart_items)
        payment_method = validated_data["payment_method"]
        payment_status = "cod_pending" if payment_method == Order.PaymentMethod.COD else "pending"

        order = Order.objects.create(
            user=request.user,
            address=address,
            receiver_name=address.full_name,
            receiver_phone=address.phone,
            receiver_address=address.address,
            payment_method=payment_method,
            payment_status=payment_status,
            total_amount=total,
        )

        order_items = []
        for item in cart_items:
            image = item.variant.product.images.order_by("order").first()
            image_url = ""
            if image:
                image_url = request.build_absolute_uri(image.image_url.url)
            order_items.append(OrderItem(
                order=order,
                variant=item.variant,
                product_id=item.variant.product_id,
                product_name=item.variant.product.name,
                variant_name=item.variant.name,
                product_image=image_url,
                unit_price=item.variant.price,
                quantity=item.quantity,
                subtotal=item.subtotal,
            ))
            updated = ProductVariant.objects.filter(
                pk=item.variant_id,
                stock__gte=item.quantity,
            ).update(stock=F("stock") - item.quantity)
            if not updated:
                raise serializers.ValidationError({
                    "detail": "Không đủ hàng trong kho.",
                    "items": [f"{item.variant.product.name} - {item.variant.name}: số lượng vừa được người khác mua trước."],
                })
        OrderItem.objects.bulk_create(order_items)
        CartItem.objects.filter(pk__in=[item.pk for item in cart_items]).delete()
        return order
