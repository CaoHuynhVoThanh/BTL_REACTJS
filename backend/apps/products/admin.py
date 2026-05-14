from django.contrib import admin
from .models import ProductType, Series, Category, Product, ProductAttribute, ProductImage, ProductColor, ProductVariant


@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = ["name", "product_type", "slug"]
    list_filter = ["product_type"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "series", "slug"]
    list_filter = ["series__product_type", "series"]
    prepopulated_fields = {"slug": ("name",)}


class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 3
    fields = ["group", "name", "value", "order"]


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 2


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 2


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "product_type", "series", "category", "created_at"]
    list_filter = ["product_type", "series", "category"]
    search_fields = ["name"]
    inlines = [ProductAttributeInline, ProductImageInline, ProductColorInline, ProductVariantInline]
