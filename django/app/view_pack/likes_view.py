from django.http.response import HttpResponseForbidden
from ..serializers.favorite_serializer import FavoriteSerializer
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin, UserPassesTestMixin
from django.db.models import Q
from django.views.generic import ListView,View;
from ..models import Favorite,Product
from django.http import JsonResponse;



class ProductLikesShow(ListView):
    response = {"data":{"likes":[]},"errors":[],"status":""}

    def has_permission(self):
        self.user = self.request.user
        user_auth_id = self.user.id if self.user.id else 0
        user_id = self.request.GET.get("user_id","")

        if user_id.isdigit():
            return int(user_auth_id) == int(user_id);
        else:
            return False;

    def get(self,request,*args,**kw):
        if self.has_permission():
           favorites = Favorite.objects.filter(user=self.user)
           likes = []

           for favorite in favorites:
               data = FavoriteSerializer(favorite).data.get("product")
               likes.append(data)

           self.response["data"]["likes"] = likes
        else:
           self.response["errors"].insert(0,"Invalid request")
        return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False})


class ProductLikesDelete(View):
    def get(self,request,*args,**kw):
        user = request.user;

        if not user.is_authenticated:
            return HttpResponseForbidden()

        product_ids = request.GET.getlist("product_id")

        for product_id in product_ids:
            like = user.favorite_set.filter(product__id=product_id)
            like.delete()

        return JsonResponse({"status":"ok"})


class ProductLikes(ListView):
     response = {"data":[],"errors":[],"status":""}
     
     def test_func(self):
         self.user = self.request.user;
         self.productId = self.request.GET.get("productId","")
         user_like = Favorite.objects.filter(Q(product__id=self.productId) & Q(user__id=self.user.id)).count();
         return user_like==0  and self.request.user.is_authenticated and self.productId.isdigit();

     def get(self,request,*args,**kw):

         if self.test_func():
             product = Product.objects.filter(id=self.productId).first()

             if product:
                favorite = Favorite(user=self.user,product=product)
                favorite.save();
                self.response["status"]="ok"
             else:
                self.response["errors"].append("The product doesn't exist")
         else:
             self.response["errors"].append("Вы уже лайкнули этот товар")
         return JsonResponse(self.response)