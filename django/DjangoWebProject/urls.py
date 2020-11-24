"""
Definition of urls for DjangoWebProject.
"""

from django.urls import path,re_path
from django.contrib import admin
from app.views import NotFound,ProductAvailableCount,LoginView,ProductsView,SignUpView,ProductView,ProductLikesShow,ProductSort,ProductInfo,ProductInfoBrands,ProductLikes
from app.view_pack.search_view import Search
from app.view_pack.comment_view import Comment_View,CommentList_View
from app.view_pack.order_view import Order_View,Delete_Order,Get_Order,Order_Buy


urlpatterns = [
    re_path(r"^api/products$",ProductsView.as_view()),
    re_path(r"^api/signup",SignUpView.as_view()),
    re_path(r"^api/login",LoginView.as_view()),
    re_path(r"^api/product/(?P<pk>\d+)",ProductView.as_view()),
    re_path(r"^api/addcomment$",Comment_View.as_view()),
    re_path(r"^api/sort/",ProductSort.as_view()),
    re_path(r"^api/getlikes",ProductLikesShow.as_view()),
    re_path(r"^api/addorder",Order_View.as_view()),
    re_path(r"^api/deleteorder",Delete_Order.as_view()),
    re_path(r"^api/get-orders",Get_Order.as_view()),
    re_path(r"^api/comments/(?P<post_id>\d+)",CommentList_View.as_view()),
    re_path(r"^api/search",Search.as_view()),
    re_path(r"^api/products-info/",ProductInfo.as_view()),
    re_path(r"^api/getbrands/",ProductInfoBrands.as_view()),
    re_path(r"^api/addlike/",ProductLikes.as_view()),
    re_path(r"^api/buy-products/",Order_Buy.as_view()),
    re_path(r"^api/product-count/",ProductAvailableCount.as_view()),
    path('admin/', admin.site.urls),
    re_path(r"^",NotFound.as_view()),
]
