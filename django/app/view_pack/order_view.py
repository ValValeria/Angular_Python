from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models.aggregates import Sum
from django.http.response import Http404, JsonResponse
from django.views.generic import ListView,View;
from ..models import Product,Order;
from django.contrib.auth.models import User


class Get_Order(LoginRequiredMixin,ListView):
      response = {"data":[]}
      redirect_authenticated_user=True

      def get(self, request, *args, **kwargs):
          user=request.user;
          orders=user.order_set.annotate(amount_of_orders=Sum("product")).all();
          return JsonResponse(list(orders.values()), safe=False, json_dumps_params={'ensure_ascii': False})



class Delete_Order(LoginRequiredMixin,ListView):
      redirect_authenticated_user=True

      def get(self, request, *args, **kwargs):
          user=request.user;
          order_id = request.GET.get("product_id");

          if order_id.isdigit():
               order=Order.objects.filter(product__id=order_id).filter(user__id=user.id).first();
               order.delete();
          else:
               return Http404(); 
          return JsonResponse({"status":"ok"})



class Order_Buy(LoginRequiredMixin,ListView): 
      "Handle the process, related to the purchasing of good"
      response = {"messages":[],"data":{},"status":""}
      redirect_authenticated_user=True

      def get(self,request,*args,**kw):
          if request.user.is_authenticated:
               user = request.user
               orders = user.order_set.filter(status=0).only("status")

               for item in orders:
                   item.status = 1;
                   item.save()
               
               self.response["status"]="ok";

               return JsonResponse(self.response);
          else:
               return Http404();             



class Order_View(LoginRequiredMixin,ListView):
      response = {"messages":[],"data":[],"status":""}
      login_url="/"
      redirect_authenticated_user=True


      def get(self, request, *args, **kwargs):
          user = request.user;
          product_id = request.GET.get("product_id","");
          count = request.GET.get("count","")
         
          if product_id.isdigit() and count.isdigit():
              product = Product.objects.filter(id=product_id);
              count = int(count); 

              if product.exists():  
                  self.product_exists(product=product,user=user,count=count)
              else:
                 self.response["messages"].append("The product doesn't exist");

              return JsonResponse(self.response);

          return Http404();


      def product_exists(self,product,user,count):
         product = product.first();
         product_count = product.count;
         order = user.order_set.filter(product__id=product.id).first();
         ostatok = product_count-count;

         if order  or ostatok>=0:
            if order: #want to change the order   
               ostatok_without = product_count+order.count-count; #количество товаров без данного заказа

               if ostatok_without<=product_count and ostatok_without and product_count>=count:   
                  order.count = count;
               else:
                  self.response["messages"].append("The product has run out. You can't buy more than {}".format(product_count));   
                  self.response["data"].append({"available":product_count})   
                  return JsonResponse(self.response);
            else:
                    order = Order(user=user,count=count,product=product)
                    product.count=ostatok;
                    product.save();
                    order.save();
                    self.response["status"]="ok";
         else:
            self.response["messages"].append("The product is out of stock.");

            if product_count>0:
               self.response["data"].append({"available":product_count})   
               self.response["status"]="ok";