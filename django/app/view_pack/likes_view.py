from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin, UserPassesTestMixin
from django.db.models import Q
from django.views.generic import ListView,View;
from ..models import Favorite,Product
from django.http import JsonResponse;



class ProductLikesShow(LoginRequiredMixin,PermissionRequiredMixin,ListView):
    response = {"data":[],"errors":[],"status":""}
    raise_exception = False
    redirect_authenticated_user=True


    def has_permission(self):
        self.user = self.request.user
        user_id = self.request.GET.get("user_id","")

        if user_id.isdigit():
            return int(self.user.id) == int(user_id);
        else:
            return False;

    def get(self,request,*args,**kw):
        favorites = Favorite.objects.filter(user=self.user).values()
        self.response["data"] = list(favorites);
        return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False})



class ProductLikes(LoginRequiredMixin,UserPassesTestMixin,ListView):
     raise_exception = False
     response = {"data":[],"errors":[],"status":""}
     redirect_authenticated_user=True

     
     def test_func(self):
         self.user = self.request.user;
         self.productId = self.request.GET.get("productId","")
         user_like = Favorite.objects.filter(Q(product__id=self.productId) & Q(user__id=self.user.id)).count();
         return user_like==0;


     def get(self,request,*args,**kw):

         if self.productId.isdigit():
             product = Product.objects.filter(id=self.productId).first()

             if product:
                favorite = Favorite(user=self.user,product=product)
                favorite.save();
                self.response["status"]="ok"
             else:
                self.response["errors"].append("The product doesn't exist")
         else:
             self.response["errors"].append("Invalid productId")
         return JsonResponse(self.response)