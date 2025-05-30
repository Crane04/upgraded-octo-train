from django.urls import path
from .views import *

urlpatterns = [
    path("compare", compare_images, name="compare images"),
    path("medical-chat", medical_chat, name = "medical chat")
]