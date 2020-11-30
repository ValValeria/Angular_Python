from ..serializers.user_serializer import UserSerializer
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models.aggregates import Sum
from django.http.response import Http404, HttpResponseForbidden, JsonResponse
from django.views.generic import ListView,View;
from ..models import Product,Order;
from django.contrib.auth.models import User


class Get_Order(ListView):
      response = {"data":[]}

      def get(self, request, *args, **kwargs):
          print(request.user)
          if not request.user.is_authenticated:
              return HttpResponseForbidden();
              
          user=request.user;
          orders=user.order_set.all();
          orders_sum = user.order_set.aggregate(amount_of_orders=Sum("count"));
          sum_products = user.order_set.aggregate(amount_of_orders=Sum("product"));
          data = {"active":[],"unactive":[]}
       
          for order in orders:

              obj = {"title":order.product.title,
                    "price":order.product.price,
                    "id":order.product.id,
                    "count":order.count,
                    "status":order.status,
                    "category":order.product.category,
                    "brand":order.product.brand                    
                    }
              
              if  not order.status:
                  data["active"].append(obj)
              else:
                  data["unactive"].append(obj)

          self.response["data"]=data;
          self.response["amount_of_orders"] = orders_sum.get("amount_of_orders")
          self.response["amount_of_products"] = sum_products.get("amount_of_orders")
          return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False})



class Delete_Order(ListView):

      def get(self, request, *args, **kwargs):
          user=request.user;

          try:   
             if not user.is_authenticated:
                raise AssertionError(); 

             orders_id = [ int(x) for x in request.GET.getlist("product_id")];

             if orders_id:
               order=Order.objects.filter(product__id__in=orders_id).filter(user__id=user.id);
               order.delete();
               return JsonResponse({"status":"ok"})
          except:pass
          return HttpResponseForbidden(); 



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



class Order_View(ListView):
      response = {"messages":[],"data":[],"status":""}
      login_url="/"
      redirect_authenticated_user=True


      def get(self, request, *args, **kwargs):

          if not request.user.is_authenticated:
              return Http404();

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
               ostatok_without = product_count-order.count-count; #количество товаров без данного заказа

               if ostatok_without<=product_count and ostatok_without and product_count>=count:   
                  order.count = count;
                  self.response["status"] = "ok";
                  order.save();
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