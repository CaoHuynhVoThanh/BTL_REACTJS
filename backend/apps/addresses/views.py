from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Address
from .serializers import AddressSerializer


class AddressListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/addresses/  – Danh sách địa chỉ của user hiện tại
    POST /api/addresses/  – Thêm địa chỉ mới
    """

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        is_default = serializer.validated_data.get("is_default", False)
        
        # Nếu chưa có địa chỉ nào, bắt buộc phải là mặc định
        if not Address.objects.filter(user=user).exists():
            is_default = True
            serializer.validated_data["is_default"] = True

        if is_default:
            # Bỏ mặc định các địa chỉ khác
            Address.objects.filter(user=user).update(is_default=False)
            
        serializer.save(user=user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/addresses/{id}/  – Chi tiết
    PUT    /api/addresses/{id}/  – Cập nhật
    DELETE /api/addresses/{id}/  – Xoá
    """

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        user = self.request.user
        is_default = serializer.validated_data.get("is_default", False)

        if is_default:
            # Bỏ mặc định các địa chỉ khác (trừ cái đang update, dù save sau cũng đè lên)
            Address.objects.filter(user=user).exclude(pk=self.get_object().pk).update(is_default=False)
            
        serializer.save(user=user)

    def perform_destroy(self, instance):
        user = instance.user
        was_default = instance.is_default
        instance.delete()

        # Nếu xóa địa chỉ mặc định, tự động gán mặc định cho địa chỉ gần đây nhất (nếu có)
        if was_default:
            next_address = Address.objects.filter(user=user).first()
            if next_address:
                next_address.is_default = True
                next_address.save(update_fields=["is_default"])


class SetDefaultAddressView(APIView):
    """
    POST /api/addresses/{id}/set-default/  – Đặt làm địa chỉ mặc định
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        # Bỏ default tất cả địa chỉ cũ
        Address.objects.filter(user=request.user).update(is_default=False)
        try:
            address = Address.objects.get(pk=pk, user=request.user)
        except Address.DoesNotExist:
            return Response(
                {"detail": "Không tìm thấy địa chỉ."},
                status=status.HTTP_404_NOT_FOUND,
            )
        address.is_default = True
        address.save(update_fields=["is_default"])
        return Response(AddressSerializer(address).data)
