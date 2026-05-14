from django.urls import path
from .views import CartView, CartAddView, CartItemUpdateView

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/add/", CartAddView.as_view(), name="cart-add"),
    path("cart/<int:pk>/", CartItemUpdateView.as_view(), name="cart-item"),
]
