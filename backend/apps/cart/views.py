from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import ProductVariant
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer


def _get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    """
    GET /api/cart/  – Lấy toàn bộ giỏ hàng
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = _get_or_create_cart(request.user)
        return Response(CartSerializer(cart, context={"request": request}).data)


class CartAddView(APIView):
    """
    POST /api/cart/add/
    Body: { "variant_id": 1, "quantity": 2 }
    Nếu variant đã có trong giỏ → cộng thêm số lượng.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        variant_id = serializer.validated_data["variant_id"]
        quantity = serializer.validated_data["quantity"]

        try:
            variant = ProductVariant.objects.get(pk=variant_id)
        except ProductVariant.DoesNotExist:
            return Response(
                {"detail": "Biến thể sản phẩm không tồn tại."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart = _get_or_create_cart(request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, variant=variant)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        return Response(
            CartSerializer(cart, context={"request": request}).data,
            status=status.HTTP_200_OK,
        )


class CartItemUpdateView(APIView):
    """
    PUT    /api/cart/{item_id}/  – Cập nhật số lượng
    DELETE /api/cart/{item_id}/  – Xoá sản phẩm khỏi giỏ
    """

    permission_classes = [IsAuthenticated]

    def _get_item(self, request, pk):
        try:
            return CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return None

    def put(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({"detail": "Không tìm thấy."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item.quantity = serializer.validated_data["quantity"]
        item.save()

        cart = _get_or_create_cart(request.user)
        return Response(CartSerializer(cart, context={"request": request}).data)

    def delete(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({"detail": "Không tìm thấy."}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        cart = _get_or_create_cart(request.user)
        return Response(CartSerializer(cart, context={"request": request}).data)
