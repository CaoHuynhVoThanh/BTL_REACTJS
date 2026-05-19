import http.client
import json
import os

from django.db.models import Max, Min, Q, Sum
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import Product


OPENROUTER_HOST = "openrouter.ai"
OPENROUTER_PATH = "/api/v1/chat/completions"
DEFAULT_MODEL = "openai/gpt-4o-mini"


def _format_vnd(value):
    if value is None:
        return "Lien he"
    return f"{int(value):,}".replace(",", ".") + " VND"


def _product_context(user_message):
    words = [word for word in user_message.split() if len(word) >= 2]
    query = Q()
    for word in words[:8]:
        query |= Q(name__icontains=word)
        query |= Q(product_type__name__icontains=word)
        query |= Q(series__name__icontains=word)
        query |= Q(category__name__icontains=word)

    products = Product.objects.annotate(
        min_price=Min("variants__price"),
        max_price=Max("variants__price"),
        total_stock=Sum("variants__stock"),
    ).select_related(
        "product_type", "series", "category"
    ).prefetch_related("variants")

    if query:
        products = products.filter(query).distinct()

    lines = []
    for product in products.order_by("-created_at")[:20]:
        stock = product.total_stock or 0
        if product.min_price and product.max_price and product.min_price != product.max_price:
            price = f"{_format_vnd(product.min_price)} - {_format_vnd(product.max_price)}"
        else:
            price = _format_vnd(product.min_price)

        variants = []
        for variant in product.variants.all()[:5]:
            variants.append(f"{variant.name}: {_format_vnd(variant.price)}, ton {variant.stock}")

        lines.append(
            f"- ID {product.id}: {product.name}; gia {price}; tong ton {stock}; "
            f"loai {product.product_type.name if product.product_type else 'N/A'}; "
            f"series {product.series.name if product.series else 'N/A'}; "
            f"bien the [{'; '.join(variants) if variants else 'khong co'}]"
        )

    if not lines:
        return "Khong tim thay san pham lien quan trong DB cho cau hoi nay."

    return "Du lieu san pham trong DB hien tai:\n" + "\n".join(lines)


class ChatbotMessageView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
        if not api_key:
            return Response(
                {"detail": "Chua cau hinh OPENROUTER_API_KEY tren server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        if not api_key.startswith("sk-or-v1-"):
            return Response(
                {
                    "detail": (
                        "OPENROUTER_API_KEY khong dung dinh dang. "
                        "Key OpenRouter thuong bat dau bang sk-or-v1-."
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        user_message = str(request.data.get("message", "")).strip()
        history = request.data.get("history", [])
        if not user_message:
            return Response(
                {"detail": "Tin nhan khong duoc de trong."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        safe_history = []
        if isinstance(history, list):
            for item in history[-8:]:
                role = item.get("role") if isinstance(item, dict) else None
                content = item.get("content") if isinstance(item, dict) else None
                if role in {"user", "assistant"} and isinstance(content, str) and content.strip():
                    safe_history.append({"role": role, "content": content[:1200]})

        messages = [
            {
                "role": "system",
                "content": (
                    "Ban la tro ly tu van cua Fuji Store. Tra loi ngan gon, than thien bang tieng Viet. "
                    "Ho tro khach ve san pham may anh, ong kinh, phim, Instax, gio hang, thanh toan va van chuyen. "
                    "Chi su dung du lieu san pham duoc cung cap ben duoi khi noi ve gia va ton kho. "
                    "Neu du lieu khong co san pham phu hop, hay noi khach tim tren trang san pham hoac lien he cua hang."
                ),
            },
            {"role": "system", "content": _product_context(user_message)},
            *safe_history,
            {"role": "user", "content": user_message[:2000]},
        ]

        payload = {
            "model": os.getenv("OPENROUTER_MODEL", DEFAULT_MODEL),
            "messages": messages,
            "temperature": 0.4,
            "max_tokens": 450,
        }
        body = json.dumps(payload).encode("utf-8")
        authorization = f"Bearer {api_key}"
        connection = None

        try:
            connection = http.client.HTTPSConnection(OPENROUTER_HOST, timeout=30)
            connection.request(
                "POST",
                OPENROUTER_PATH,
                body=body,
                headers={
                    "Authorization": authorization,
                    "Content-Type": "application/json",
                    "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "http://localhost:5173"),
                    "X-Title": os.getenv("OPENROUTER_APP_NAME", "Fuji Store"),
                    "User-Agent": "FujiStore/1.0",
                },
            )
            response = connection.getresponse()
            response_body = response.read().decode("utf-8", errors="replace")
            if response.status >= 400:
                detail = "OpenRouter tra ve loi."
                try:
                    error_data = json.loads(response_body)
                    detail = error_data.get("error", {}).get("message") or detail
                except json.JSONDecodeError:
                    pass
                return Response(
                    {"detail": detail, "error": response_body},
                    status=status.HTTP_502_BAD_GATEWAY,
                )
            data = json.loads(response_body)
        except Exception as error:
            return Response(
                {"detail": f"Khong the ket noi OpenRouter: {error}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        finally:
            if connection:
                connection.close()

        reply = (
            data.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "")
            .strip()
        )
        if not reply:
            return Response(
                {"detail": "OpenRouter khong tra ve noi dung."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"reply": reply})
