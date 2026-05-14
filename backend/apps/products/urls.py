from django.urls import path
from .views import (
    ProductTypeListView, SeriesListView,
    CategoryListView, ProductListView, ProductDetailView,
)

urlpatterns = [
    path("product-types/", ProductTypeListView.as_view(), name="product-type-list"),
    path("series/", SeriesListView.as_view(), name="series-list"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
]
