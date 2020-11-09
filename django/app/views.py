from django.http.response import  Http404, HttpResponseForbidden
from django.views.generic import ListView,View;
from app.models import Product;
from django.http import JsonResponse;
from django.contrib.auth import authenticate,login
from app.forms import AuthenticateForm
from django.contrib.auth.models import Permission, User
from django.contrib.contenttypes.models import ContentType
from django.db.models import Max,Min
from django.core.paginator import Paginator


class ProductsView(ListView):
      def get(self, *args, **kwargs):
          products = list(Product.objects.all().values())
          response =  JsonResponse(products, safe=False, json_dumps_params={'ensure_ascii': False})
          return response



class ProductInfo(ListView):
      response = {"data":[]}

      def get(self,request,*args,**kw):
          categories = Product.objects.distinct().all().values("category")
          brand = Product.objects.distinct().all().values("brand")
          max_price = Product.objects.aggregate(max_price=Max("price"))  
          min_price = Product.objects.aggregate(min_price=Min("price"))
          brands = map(lambda x:x.get("brand"),brand)
          self.response["data"]={"categories":list(categories),"price":[min_price,max_price],"brands":list(brands)}
          return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False})



class ProductView(ListView):

      def get(self, request, *args, **kwargs):
          product = Product.objects.filter(id__contains=kwargs["pk"]);
 
          if product.exists():
              return JsonResponse(product.values()[0])
          else :
              return HttpResponseForbidden()



class ProductSort(ListView):
      params = None;
      
      def __init__(self,*args):
          super().__init__(*args)
          self.sort_by = {"price":self.sort_by_price,"brand":self.sort_by_brand,"category":self.sort_by_category}

      def get(self,request,*args,**kwargs):
          self.params = self.request.GET
          criteria = self.params.get("sortBy")

          if criteria in self.sort_by.keys():
              func = self.sort_by.get(criteria)().values();
              return JsonResponse({"data":list(func)}, json_dumps_params={'ensure_ascii': False})
          else:
              return Http404();  
      
      def sort_by_price(self):
          prices = [self.params.get("min"),self.params.get("max")]

          if prices[0].isdigit() and prices[1].isdigit():
             products_obj = Product.objects.filter(price__lt=prices[1]).filter(price__gt=prices[0])  
             return products_obj
          else:
             return Product.objects.all()[:5]

      def sort_by_category(self):
          category = self.params.get("category")                    
          return Product.objects.filter(category__iexact=category)

      def sort_by_brand(self):
          brand = self.params.get("brand")                    
          return Product.objects.filter(brand__iexact=brand)


class LoginView(View):
      response = {}  
      form = AuthenticateForm;

      def post(self, *args, **kwargs):
          form = self.form(self.request.GET,True)    
          if self.form.is_valid() and not self.request.user.is_authenticated: 
              user = authenticate(form.cleaned_data['username'],form.cleaned_data['password'])
              if user is not None:
                  login(self.request,user)
                  self.response["status"]="user"
          else:
              self.response['errors']=["Invalid data"]

          return JsonResponse(self.response)


class SignUpView(View):
      form = AuthenticateForm;
      response = {}

      def post(self,request, *args, **kwargs):
          form = self.form(self.request.GET)    
          if form.is_valid() and not request.user.is_authenticated: 
              user = User.create_user(form.cleaned_data['username'],form.cleaned_data['email'],form.cleaned_data['password'])
              content_type = ContentType.objects.get_for_model(Product)
              permission = Permission.objects.get(
                  codename='add_comments',
                  content_type=content_type)
              user.user_permissions.add(permission)
              self.response['status']="user";
              self.response["message"]={"id":user.id}
          else:
              self.response['errors']=form.errors
          return JsonResponse(self.response)
