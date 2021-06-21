from app.view_pack.admin_view import AdminView, AdminProductImages
from django.urls import path, re_path
from django.contrib import admin
from app.views import *
from app.view_pack.search_view import Search
from app.view_pack.comment_view import Comment_View, CommentList_View
from app.view_pack.order_view import Order_View, Delete_Order, Get_Order, Order_Buy
from app.view_pack.authenticate import SignUpView, LoginView
from app.view_pack.likes_view import ProductLikesShow, ProductLikes, ProductLikesDelete
from app.view_pack.products import *
from app.view_pack.admin_users import AdminUsers


urlpatterns = [
    re_path(r"^api/send-letter", SendLetter.as_view()),
    re_path(r"^api/delete-likes/", ProductLikesDelete.as_view()),
    re_path(r"^api/info-products/", ProductInfo.as_view()),
    re_path(r"^api/products", ProductsView.as_view()),
    re_path(r"^api/signup", SignUpView.as_view()),
    re_path(r"^api/login", LoginView.as_view()),
    re_path(r"^api/product/(?P<pk>\d+)", ProductView.as_view()),
    re_path(r"^api/addcomment$", Comment_View.as_view()),
    re_path(r"^api/sort/", ProductSort.as_view()),
    re_path(r"^api/getlikes", ProductLikesShow.as_view()),
    re_path(r"^api/addorder", Order_View.as_view()),
    re_path(r"^api/deleteorder", Delete_Order.as_view()),
    re_path(r"^api/get-orders", Get_Order.as_view()),
    re_path(r"^api/comments/(?P<post_id>\d+)", CommentList_View.as_view()),
    re_path(r"^api/search", Search.as_view()),
    re_path(r"^api/getbrands/", ProductInfoBrands.as_view()),
    re_path(r"^api/addlike", ProductLikes.as_view()),
    re_path(r"^api/buy-products", Order_Buy.as_view()),
    re_path(r"^api/product-count", ProductAvailableCount.as_view()),
    re_path(r"^api/delete-user", DeleteUser.as_view()),
    re_path(r"^api/user-info", UserProfile.as_view()),
    re_path(r"^api/users", AdminUsers.as_view()),
    re_path(r"^api/change-avatar", ChangeAvatar.as_view()),
    re_path(r'^admin/products/<int:id>/addimages', AdminProductImages.as_view()),
    re_path(r"^((?!app/static).)*$", NotFound.as_view())
]
