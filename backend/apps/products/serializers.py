from rest_framework import serializers
from .models import ProductType, Series, Category, Product, ProductAttribute, ProductImage, ProductColor, ProductVariant


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = ["id", "name", "slug"]


class SeriesSerializer(serializers.ModelSerializer):
    product_type = ProductTypeSerializer(read_only=True)

    class Meta:
        model = Series
        fields = ["id", "name", "slug", "description", "product_type"]


class CategorySerializer(serializers.ModelSerializer):
    series = SeriesSerializer(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "series"]


class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ["id", "group", "name", "value", "order"]


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image_url", "order"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if request and obj.image_url:
            return request.build_absolute_uri(obj.image_url.url)
        return obj.image_url.url if obj.image_url else None


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ["id", "name", "hex_code"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "name", "price", "stock"]


# ── List ──────────────────────────────────────────────────────────────────────
class ProductListSerializer(serializers.ModelSerializer):
    product_type = ProductTypeSerializer(read_only=True)
    series = SeriesSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    base_price = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()
    max_price = serializers.SerializerMethodField()
    stock = serializers.SerializerMethodField()
    quantity = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "product_type", "series", "category",
            "thumbnail", "base_price", "min_price", "max_price",
            "stock", "quantity",
        ]

    def get_thumbnail(self, obj):
        first = obj.images.first()
        if not first:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(first.image_url.url) if request else first.image_url.url

    def get_base_price(self, obj):
        variant = obj.variants.order_by("price").first()
        return str(variant.price) if variant else None

    def get_min_price(self, obj):
        price = getattr(obj, "min_price", None)
        if price is None:
            variant = obj.variants.order_by("price").first()
            price = variant.price if variant else None
        return str(price) if price is not None else None

    def get_max_price(self, obj):
        price = getattr(obj, "max_price", None)
        if price is None:
            variant = obj.variants.order_by("-price").first()
            price = variant.price if variant else None
        return str(price) if price is not None else None

    def get_stock(self, obj):
        stock = getattr(obj, "total_stock", None)
        if stock is None:
            stock = sum(variant.stock for variant in obj.variants.all())
        return stock or 0

    def get_quantity(self, obj):
        return self.get_stock(obj)


# ── Detail ────────────────────────────────────────────────────────────────────
class ProductDetailSerializer(serializers.ModelSerializer):
    product_type = ProductTypeSerializer(read_only=True)
    series = SeriesSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    specs = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    colors = ProductColorSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "description",
            "product_type", "series", "category",
            "specs", "images", "colors", "variants",
            "created_at", "updated_at",
        ]

    def get_specs(self, obj):
        result = {}
        for attr in obj.attributes.all():
            if attr.group in {"Bo loc", "Bộ lọc"}:
                continue
            group = attr.group or "Thông số khác"
            result.setdefault(group, [])
            result[group].append({"name": attr.name, "value": attr.value})
        return result
