from .models import Product,Comment
from django.contrib import admin
from django.utils.html import format_html


class CommentInstanceInline(admin.TabularInline):
    model = Comment


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
     list_display=("title","price","count","category","comments",)
     list_filter=("price","count",)
     inlines=[CommentInstanceInline]

     def comments(self,obj):
         return obj.comment_set.all().count()


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
     list_display=("sender","message","product",);

     def product(self,obj):
         return format_html('<a href={}>{}</a>',"/admin/app/product/{}/change/".format(obj.post.id),obj.post.title);

     def message(self,obj):
         return obj.message[:30]
     
