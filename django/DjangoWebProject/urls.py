"""
Definition of urls for DjangoWebProject.
"""

from django.urls import path,re_path
from django.contrib import admin
from app.views import ProductsView,SignUpView,ProductView
from app.view_pack.search_view import Search
from app.view_pack.comment_view import Comment_View,CommentList_View


urlpatterns = [
    re_path(r"^api/products$",ProductsView.as_view()),
    re_path(r"^api/signup",SignUpView.as_view()),
    re_path(r"^api/product/(?P<pk>\d+)",ProductView.as_view()),
    re_path(r"^api/addcomment/",Comment_View.as_view()),
    re_path(r"^api/comments/(?P<post_id>\d+)",CommentList_View.as_view()),
    re_path(r"^api/search",Search.as_view()),
    path('admin/', admin.site.urls),
]
