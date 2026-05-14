from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer, ChangePasswordSerializer


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/users/me/  – Lấy thông tin cá nhân
    PUT  /api/users/me/  – Cập nhật thông tin cá nhân
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """
    POST /api/users/change-password/  – Đổi mật khẩu
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Đổi mật khẩu thành công."}, status=status.HTTP_200_OK)
