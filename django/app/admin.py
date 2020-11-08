from .models import Product,Comment,Order
from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.models import User
from django.db.models import Count,Sum



class OrderInstanceInline(admin.TabularInline):
    model = Order

class CommentInstanceInline(admin.TabularInline):
    model = Comment


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
     list_display=("id","title","price","count","category","comments","ordered","people_who_bought_it")
     list_filter=("price","count",)
     inlines=[CommentInstanceInline]

     def comments(self,obj):
         return obj.comment_set.all().count()

     def ordered(self,obj):
         count = Order.objects.filter(product__id=obj.id).aggregate(sum=Sum("count"))
         return count.get("sum");

     def people_who_bought_it(self,obj):
         users = obj.order_set.filter().aggregate(count=Count("user"))
         return users.get("count",0)




@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
     list_display=("sender","message","product",);
     list_filter=("date",)

     def product(self,obj):
         return format_html('<a href={}>{}</a>',"/admin/app/product/{}/change/".format(obj.post.id),obj.post.title);

     def message(self,obj):
         return obj.message[:30]



admin.site.unregister(User)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
     list_display=("email","username","last_name","first_name","the_amount_of_orders");
     inlines=[OrderInstanceInline]

     def the_amount_of_orders(self,obj):
          return obj.order_set.all().count()

         