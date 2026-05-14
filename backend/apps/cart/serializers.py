from rest_framework import serializers

from apps.products.serializers import ProductVariantSerializer
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    variant_id = serializers.PrimaryKeyRelatedField(
        source="variant",
        queryset=__import__("apps.products.models", fromlist=["ProductVariant"]).ProductVariant.objects.all(),
        write_only=True,
    )
    subtotal = serializers.DecimalField(max_digits=14, decimal_places=0, read_only=True)
    product_name = serializers.CharField(source="variant.product.name", read_only=True)
    product_id = serializers.IntegerField(source="variant.product.id", read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "variant", "variant_id", "product_id", "product_name", "product_image", "quantity", "subtotal"]

    def get_product_image(self, obj):
        first_img = obj.variant.product.images.order_by("order").first()
        if not first_img:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(first_img.image_url.url)
        return first_img.image_url.url


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=14, decimal_places=0, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "total", "updated_at"]


class AddToCartSerializer(serializers.Serializer):
    """Body: { variant_id, quantity }"""

    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
