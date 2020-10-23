"""
Definition of urls for DjangoWebProject.
"""

from datetime import datetime
from django.urls import path,re_path
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from app import forms, views
from app.views import ProductsView,SignUpView

urlpatterns = [
    re_path(r"^api/products",ProductsView.as_view()),
    re_path(r"^api/signup",SignUpView.as_view()),
    re_path(r"^api/product/(?P<pk>\d+)",ProductsView.as_view()),
    path('admin/', admin.site.urls),
]
