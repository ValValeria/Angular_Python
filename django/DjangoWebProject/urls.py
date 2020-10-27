"""
Definition of urls for DjangoWebProject.
"""

from django.urls import path,re_path
from django.contrib import admin
from app.views import ProductsView,SignUpView,Search,ProductView

urlpatterns = [
    re_path(r"^api/products$",ProductsView.as_view()),
    re_path(r"^api/signup",SignUpView.as_view()),
    re_path(r"^api/product/(?P<pk>\d+)",ProductView.as_view()),
    re_path(r"^api/search",Search.as_view()),
    path('admin/', admin.site.urls),
]
