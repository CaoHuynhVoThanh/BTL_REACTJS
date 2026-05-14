import random
import string
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.serializers import UserSerializer
from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()


def _token_pair(user):
    """Tạo access + refresh token cho user."""
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def _generate_otp(length=6):
    return "".join(random.choices(string.digits, k=length))


def _otp_cache_key(email, purpose):
    return f"otp:{purpose}:{email}"


class RegisterView(APIView):
    """
    POST /api/auth/register/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": _token_pair(user),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /api/auth/login/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": _token_pair(user),
            }
        )


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Body: { "refresh": "<refresh_token>" }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Cần cung cấp refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(
                {"detail": "Token không hợp lệ hoặc đã hết hạn."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"detail": "Đăng xuất thành công."}, status=status.HTTP_200_OK)


class SendOTPView(APIView):
    """
    POST /api/auth/send-otp/
    Body: { "email": "...", "purpose": "reset_password" }
    Gửi mã OTP 6 chữ số qua email, có hiệu lực OTP_EXPIRE_MINUTES phút.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        purpose = request.data.get("purpose", "reset_password")

        if not email:
            return Response({"detail": "Email không được để trống."}, status=400)

        # Với reset_password: email phải tồn tại
        if purpose == "reset_password":
            if not User.objects.filter(email=email).exists():
                return Response({"detail": "Email không tồn tại trong hệ thống."}, status=404)

        otp = _generate_otp()
        expire = getattr(settings, "OTP_EXPIRE_MINUTES", 10)
        cache.set(_otp_cache_key(email, purpose), otp, timeout=expire * 60)

        subject = "Mã xác minh Fujifilm Store"
        body = (
            f"Mã OTP của bạn là: {otp}\n"
            f"Mã có hiệu lực trong {expire} phút.\n"
            "Nếu bạn không yêu cầu, hãy bỏ qua email này."
        )
        try:
            send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
        except Exception as e:
            return Response({"detail": f"Không thể gửi email: {str(e)}"}, status=500)

        return Response({"detail": f"OTP đã được gửi tới {email}."})


class VerifyOTPView(APIView):
    """
    POST /api/auth/verify-otp/
    Body: { "email": "...", "otp": "123456", "purpose": "reset_password" }
    Trả về một reset_token tạm thời để đổi mật khẩu.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        otp = request.data.get("otp", "").strip()
        purpose = request.data.get("purpose", "reset_password")

        if not email or not otp:
            return Response({"detail": "Thiếu email hoặc OTP."}, status=400)

        cached = cache.get(_otp_cache_key(email, purpose))
        if cached is None:
            return Response({"detail": "OTP đã hết hạn hoặc không tồn tại."}, status=400)
        if cached != otp:
            return Response({"detail": "OTP không đúng."}, status=400)

        # OTP hợp lệ → xóa khỏi cache, tạo reset_token
        cache.delete(_otp_cache_key(email, purpose))
        reset_token = _generate_otp(32)            # 32-char random token
        cache.set(f"reset:{email}", reset_token, timeout=15 * 60)   # 15 min

        return Response({"reset_token": reset_token, "email": email})


class ResetPasswordView(APIView):
    """
    POST /api/auth/reset-password/
    Body: { "email": "...", "reset_token": "...", "new_password": "..." }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        reset_token = request.data.get("reset_token", "").strip()
        new_password = request.data.get("new_password", "")

        if not email or not reset_token or not new_password:
            return Response({"detail": "Thiếu thông tin."}, status=400)

        if len(new_password) < 8:
            return Response({"detail": "Mật khẩu phải có ít nhất 8 ký tự."}, status=400)

        cached_token = cache.get(f"reset:{email}")
        if cached_token is None or cached_token != reset_token:
            return Response({"detail": "Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Không tìm thấy tài khoản."}, status=404)

        user.set_password(new_password)
        user.save()
        cache.delete(f"reset:{email}")

        return Response({"detail": "Đặt lại mật khẩu thành công. Vui lòng đăng nhập."})
