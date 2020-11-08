from django.contrib.auth.mixins import LoginRequiredMixin
from django.http.response import Http404, JsonResponse
from django.views.generic import ListView,View;
from app.models import Product,Order;
from django.contrib.auth.models import User


class Get_Order(LoginRequiredMixin,ListView):
      response = {"data":[]}

      def get(self, request, *args, **kwargs):
          user=request.user;
          orders=user.order_set.annotate(amount_of_orders=Sum("product")).all();
          return JsonResponse(list(orders.values()), safe=False, json_dumps_params={'ensure_ascii': False})



class Delete_Order(LoginRequiredMixin,ListView):

      def get(self, request, *args, **kwargs):
          user=request.user;
          order_id = request.GET.get("product_id");

          if order_id.isdigit():
               order=Order.objects.filter(product__id=order_id).filter(user__id=user.id).first();
               order.delete();
          else:
               return Http404(); 
          return JsonResponse({"status":"ok"})




class Order_View(LoginRequiredMixin,ListView):
      response = {"messages":[],"data":[],"status":""}
      login_url="/"


      def get(self, request, *args, **kwargs):
          user = request.user;
          product_id = request.GET.get("product_id","");
          count = request.GET.get("count","")

          if product_id.isdigit() and count.isdigit():
              product = Product.objects.filter(id=product_id).first()
              product_count = product.count;
              count = int(count)  

              if product:  
                 order = user.order_set.filter(product__id=product.id).first();
                 ostatok = product_count-order.count+count;

                 if order  or product_count-count>=0:
                    if order:    
                          if ostatok<=product_count:    
                             order.count = count;
                          else:
                            self.response["messages"].append("The product has run out. You can buy not more than {}".format(product_count));   
                    else:
                          order = Order(user=user,count=count,product=product)
                    product.count -=count;
                    product.save();
                    order.save();
                 else:
                    self.response["messages"].append("The product has run out.");      
               
                 self.response["status"]="ok";
              else:
                 self.response["messages"].append("The product doesn't exist");

              return JsonResponse(self.response);

          return Http404();