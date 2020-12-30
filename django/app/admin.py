from django.db.models.expressions import F
from django.urls.conf import path, re_path
from .models import  Avatar, Letter, Product,Comment,Order, ProductImages, UserData
from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.models import Group, User
from django.db.models import Count,Sum
from django.db.models.signals import pre_delete;
from django.dispatch import receiver


URL = "http://localhost:4200/"


class OrderInstanceInline(admin.StackedInline):
    model = Order

class UserDataInstanceInline(admin.StackedInline):
    model = UserData


class AvatarInstanceInline(admin.TabularInline):
    model = Avatar

class CommentInstanceInline(admin.TabularInline):
    model = Comment

class ProductImagesInstanceInline(admin.TabularInline):
    model = ProductImages


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
     list_display=("ID","title_of_product","price","count","category","comments","ordered","likes","link")
     inlines=[ProductImagesInstanceInline,CommentInstanceInline]
     empty_value_display="-"
     search_fields=("title","category","brand")
     list_per_page = 10
     actions_selection_counter = True

     def ID(self,obj):
         return format_html('<a href={} class="btn-link">{}</a>',"/admin/app/product/{}/change/".format(obj.id),obj.id);   

     def likes(self,obj):
         return obj.favorite_set.all().count()

     def comments(self,obj):
         return obj.comment_set.all().count()
     
     def title_of_product(self,obj):
         return format_html('<a href={}>{}</a>',"/admin/app/product/{}/change/".format(obj.id),obj.title);

     def ordered(self,obj):
         count = Order.objects.filter(product__id=obj.id).filter(product__status=0).aggregate(sum=Sum("count"))
         return count.get("sum");

     def get_queryset(self, request):
         return super().get_queryset(request).order_by("id")
     
     def view_on_site(self,obj):
         return URL+"product/{}".format(obj.id)
     
     def link(self,obj):
         return format_html('<a href={} class="btn-link">Read</a>',self.view_on_site(obj));

     likes.empty_value_display="0"
     ordered.empty_value_display="0"  


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
     list_display=("ID","sender","message","product_title","product_image",);
     list_filter=("date",)
     empty_value_display="-"
     list_per_page = 10
     raw_id_fields=("post",)
     list_display_links=("message",)
     actions_selection_counter=True

     def product_title(self,obj):
         return format_html('<a href={}>{}</a>',"/admin/app/product/{}/change/".format(obj.post.id),obj.post.title);

     def message(self,obj):
         return obj.message[:30]
    
     def product_image(self,obj):
         url = obj.post.image.url;
         return format_html('<div class="user-avatar product-avatar"><img src="{}" alt="..."/></div>',url)
     
     def ID(self,obj):
         return format_html('<a href={} class="btn-link">{}</a>',"/admin/app/comment/{}/change/".format(obj.id),obj.id);   



admin.site.unregister(User)
admin.site.unregister(Group)



from django.utils.translation import gettext_lazy as _

class SortUsersByStatus(admin.SimpleListFilter):
    title=_("status")
    parameter_name="status"

    def lookups(self, request, model_admin):
        return (
            ('admin', _('admin')),
            ('user', _('user')),
        )

    def queryset(self, request, queryset):
        if self.value() == 'user':
            return queryset.filter(userdata__status="user")
        if self.value() == 'admin':
            return queryset.filter(userdata__status="admin").filter(is_staff=True)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
     list_display=("ID","image","nickname","orders","likes","status");
     search_fields=("username","email")
     list_per_page=10
     inlines = [AvatarInstanceInline,OrderInstanceInline,UserDataInstanceInline]
     list_filter=[SortUsersByStatus]
     actions_selection_counter=True
     string = '<div class="user-avatar"><img src="{}" alt="..."/></div>'
     empty_value_display="-"

     def ID(self,obj):
         return format_html('<a href={} class="btn-link">{}</a>',"/admin/auth/user/{}/change/".format(obj.id),obj.id);   

     def nickname(self,obj):
         return format_html('<a href={}>{}</a>',"/admin/auth/user/{}/change/".format(obj.id),obj.username);

     def image(self,obj):
         url = None
         try:
           url = obj.avatar.photo.url;
         except:  
           url ="/app/static/avatars/blank.jpg" 
         return format_html(self.string,url)

     def orders(self,obj):
          return obj.order_set.all().aggregate(sum=Sum("count")).get("sum",0)
     
     def likes(self,obj):
         return obj.favorite_set.all().count();
     
     def status(self,obj):
         return "admin" if obj.status=="admin" or obj.is_staff else "user";   
    
     def get_queryset(self, request):
         return super().get_queryset(request).annotate(status=F("userdata__status")).order_by("id")
     
     def last_join(self,obj):
         return  obj.last_login

     orders.empty_value_display="0"
     status.empty_value_display="user"


@admin.register(Letter)
class LetterAdmin(admin.ModelAdmin):
    list_display=("email","letter","reason","date","view")
    actions_selection_counter=True
    my_view = None

    def letter(self,obj):
        return obj.message[0:40];
    
    def reason(self,obj):
        return obj.cause
    
    def view(self,obj):
        return format_html("<a >Read</a>")
    
    def has_change_permission(self, request, obj=None):
        return None;
    
    def has_add_permission(self, request):
        return None;


# Signal is sent when the admin deletes the user
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
