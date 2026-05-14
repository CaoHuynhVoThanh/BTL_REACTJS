from django.db.models import Max, Min, Q
from rest_framework import generics, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend

from .models import ProductType, Series, Category, Product
from .serializers import (
    ProductTypeSerializer, SeriesSerializer, CategorySerializer,
    ProductListSerializer, ProductDetailSerializer,
)


class ProductPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = "page_size"
    max_page_size = 8


class ProductTypeListView(generics.ListAPIView):
    """GET /api/product-types/  – Danh sách loại sản phẩm"""
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class SeriesListView(generics.ListAPIView):
    """
    GET /api/series/                    – Tất cả dòng sản phẩm
    GET /api/series/?type={slug}        – Lọc theo loại (Camera, Lens...)
    """
    serializer_class = SeriesSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        qs = Series.objects.select_related("product_type")
        type_slug = self.request.query_params.get("type")
        if type_slug:
            qs = qs.filter(product_type__slug=type_slug)
        return qs


class CategoryListView(generics.ListAPIView):
    """
    GET /api/categories/                – Tất cả danh mục
    GET /api/categories/?series={slug}  – Lọc theo dòng sản phẩm
    """
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        qs = Category.objects.select_related("series__product_type")
        series_slug = self.request.query_params.get("series")
        if series_slug:
            qs = qs.filter(series__slug=series_slug)
        return qs


class ProductListView(generics.ListAPIView):
    """
    GET /api/products/
    Filter params:
        ?type={slug}        – Theo loại (camera, lens, film...)
        ?series={slug}      – Theo dòng (gfx-series, x-series...)
        ?category={id}      – Theo danh mục
        ?search={keyword}   – Tìm kiếm theo tên
        ?min_price={val}    – Giá tối thiểu
        ?max_price={val}    – Giá tối đa
        ?ordering={field}   – Sắp xếp (created_at, -created_at, name, -name, min_price, -min_price)
    """
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["created_at", "name", "min_price"]
    ordering = ["-created_at"]
    pagination_class = ProductPagination

    def get_queryset(self):
        # Annotate min/max price từ variants để lọc, sắp xếp và hiển thị khoảng giá
        qs = Product.objects.annotate(
            min_price=Min("variants__price"),
            max_price=Max("variants__price"),
        ).select_related(
            "product_type", "series", "category"
        ).prefetch_related("images", "variants")

        params = self.request.query_params
        type_slug = params.get("type")
        series_slug = params.get("series")
        category_id = params.get("category")
        min_price = params.get("min_price")
        max_price = params.get("max_price")

        if type_slug:
            if ProductType.objects.filter(slug=type_slug).exists():
                qs = qs.filter(product_type__slug=type_slug)
            else:
                val_list = type_slug.split(',')
                qs = qs.filter(product_type__name__in=val_list)

        if series_slug:
            if Series.objects.filter(slug=series_slug).exists():
                qs = qs.filter(series__slug=series_slug)
            else:
                val_list = series_slug.split(',')
                qs = qs.filter(series__name__in=val_list)

        if category_id:
            qs = qs.filter(category_id=category_id)
        
        if min_price:
            qs = qs.filter(min_price__gte=min_price)
        if max_price:
            qs = qs.filter(min_price__lte=max_price)

        # Lọc theo các attributes linh hoạt
        # Ví dụ: ?loai_may=Mirrorless&do_phan_giai=100MP+
        exclude_params = ['type', 'series', 'category', 'min_price', 'max_price', 'ordering', 'page', 'search', 'page_size']
        for key, value in params.items():
            if key not in exclude_params and value:
                # Chuyển slug key về tên thuộc tính (ví dụ: loai_may -> Loại máy)
                # Ở đây ta dùng icontains để linh hoạt hơn
                attr_name = key.replace('_', ' ').replace('-', ' ')
                val_list = value.split(',')
                qs = qs.filter(
                    Q(attributes__name__icontains=key) | Q(attributes__name__icontains=attr_name),
                    attributes__value__in=val_list,
                )

        return qs.distinct()


class ProductDetailView(generics.RetrieveAPIView):
    """GET /api/products/{id}/"""
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.select_related(
        "product_type", "series", "category"
    ).prefetch_related("attributes", "images", "colors", "variants")
