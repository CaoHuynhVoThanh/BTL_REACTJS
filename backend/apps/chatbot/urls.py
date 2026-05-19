from django.urls import path

from .views import ChatbotMessageView


urlpatterns = [
    path("chatbot/", ChatbotMessageView.as_view(), name="chatbot-message"),
]
