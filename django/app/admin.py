from .models import Product,Comment
from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.models import User


class CommentInstanceInline(admin.TabularInline):
    model = Comment


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
     list_display=("title","price","count","category","comments","buyers")
     list_filter=("price","count",)
     inlines=[CommentInstanceInline]

     def comments(self,obj):
         return obj.comment_set.all().count()

     def buyers(self,obj):
         return obj.buyer.all().count()


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
     list_display=("sender","message","product",);

     def product(self,obj):
         return format_html('<a href={}>{}</a>',"/admin/app/product/{}/change/".format(obj.post.id),obj.post.title);

     def message(self,obj):
         return obj.message[:30]


admin.site.unregister(User)
    

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
     list_display=("email","username","last_name","first_name","the_amount_of_orders");

     def the_amount_of_orders(self,obj):
         return obj.product_set.all().count()
     