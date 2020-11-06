from django.contrib.auth.mixins import LoginRequiredMixin
from django.http.response import Http404, JsonResponse
from django.views.generic import ListView,View;
from app.models import Product;
from django.contrib.auth.models import User


class Get_Order(LoginRequiredMixin,ListView):
      def get(self, request, *args, **kwargs):
          user=request.user;
          orders=Product.objects.filter(buyer=user);
          return JsonResponse(list(orders.values()), safe=False, json_dumps_params={'ensure_ascii': False})


class Delete_Order(LoginRequiredMixin,ListView):
      def get(self, request, *args, **kwargs):
          user=request.user;
          order_id = request.GET.get("order_id");

          if order_id.isdigit():
               order=Product.objects.filter(id=order_id).first();
               if order and order.bueyer.has(user):
                   user.product_set.remove(order);
               else:
                   return Http404(); 
          return JsonResponse({"status":"ok"})


class Order_View(LoginRequiredMixin,ListView):
      response = {"messages":[],"data":[],"status":""}
      login_url="/"
      permission_denied_message="Please, log in"

      def get(self, request, *args, **kwargs):
          user=request.user;
          product_id=request.GET.get("product_id");

          if product_id.isdigit():
              product = Product.objects.filter(id=product_id).first()
              product_count = product.count;

              if product and product_count:                      
                 user.product_set.set(product);
                 user.save();
                 product.count = product_count-1;
                 product.save()
                 self.response["status"]="ok";
              else:
                 self.response["messages"].append("The product has run out");
              return JsonResponse(self.response);
          return Http404();