from .models import Favorite, Product,Comment,Order
from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.models import User
from django.db.models import Count,Sum
from django.db.models.signals import pre_delete;
from django.dispatch import receiver



class OrderInstanceInline(admin.TabularInline):
    model = Order


class CommentInstanceInline(admin.TabularInline):
    model = Comment


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
     list_display=("id","title_of_product","price","count","category","comments","ordered","people_who_bought_it","likes")
     list_filter=("price","count")
     inlines=[CommentInstanceInline]
     empty_value_display="-"
     search_fields=("title","category","brand")
     list_per_page = 10

     def likes(self,obj):
         return obj.favorite_set.all().count()

     def comments(self,obj):
         return obj.comment_set.all().count()
     
     def title_of_product(self,obj):
         return format_html('<a href={}>{}</a>',"/admin/app/product/{}/change/".format(obj.id),obj.title);

     def ordered(self,obj):
         count = Order.objects.filter(product__id=obj.id).aggregate(sum=Sum("count"))
         return count.get("sum");

     def people_who_bought_it(self,obj):
         users = obj.order_set.filter().aggregate(count=Count("user"))
         return users.get("count",0)

     def get_queryset(self, request):
         return super().get_queryset(request).order_by("id")




@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
     list_display=("sender","message","product",);
     list_filter=("date",)
     empty_value_display="-"
     list_per_page = 10

     def product(self,obj):
         return format_html('<a href={}>{}</a>',"/admin/app/product/{}/change/".format(obj.post.id),obj.post.title);

     def message(self,obj):
         return obj.message[:30]



admin.site.unregister(User)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
     list_display=("email","nickname","the_amount_of_orders","likes","role","last_join","id");
     inlines=[OrderInstanceInline]
     empty_value_display="unknown"
     search_fields=("username","email")
     list_per_page=10

     def nickname(self,obj):
         return format_html('<a href={}>{}</a>',"/admin/auth/user/{}/change/".format(obj.id),obj.username);

     def the_amount_of_orders(self,obj):
          return obj.order_set.all().count()
     
     def likes(self,obj):
         return obj.favorite_set.all().count();
     
     def role(self,obj):
         return "admin" if obj.is_staff else "user";    
     
     def last_join(self,obj):
         return  obj.last_login


# Signal occurs when the admin deletes the user
@receiver(pre_delete,sender=User)
def delete_user(sender, instance, **kwargs):
    orders =  instance.order_set.all();

    for item in orders.iterator():
         if item.status == 0: # ne kupleno
             product = Product.objects.filter(id=item.product.id).first();
             if product:
                 product.count +=item.count
                 product.save()
             

# Site title         
admin.site.site_header = "InDigital Admin"
admin.site.site_title = "InDigital"
admin.site.index_title = "Welcome to admin panel"