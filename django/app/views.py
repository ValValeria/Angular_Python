from app.serializers.post_serializer import PostSerializer
from django.http.response import  Http404, HttpResponseBadRequest, HttpResponseForbidden
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
          categories = map(lambda obj:obj.get("category"),Product.objects.distinct().all().values("category"))
          max_price = Product.objects.aggregate(max_price=Max("price"))  
          min_price = Product.objects.aggregate(min_price=Min("price"))
          self.response["data"]={"categories":list(categories),"price":[min_price,max_price]}
          return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False})



class ProductInfoBrands(ListView):
      response = {"data":{}}

      def get(self,request,*args,**kw):
          category = request.GET.get("category");
          
          if category.isalpha() and len(category):
              brand = list(Product.objects.filter(category=category).distinct().all().values("brand"))
              brand = map(lambda v:v.get("brand"),brand)
              self.response["data"]["brands"]=list(brand);
              return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False})
          else: 
              return HttpResponseBadRequest()



class ProductView(ListView):

      def get(self, request, *args, **kwargs):
          product = Product.objects.filter(id__contains=kwargs["pk"]);
 
          if product.exists():
              return JsonResponse(product.values()[0], json_dumps_params={'ensure_ascii': False})
          else :
              return HttpResponseForbidden()



class ProductSort(ListView):
      params = None;
      
      def __init__(self,*args):
          super().__init__(*args)
          self.sort_by = {"price":self.sort_by_price,"brand":self.sort_by_brand,"category":self.sort_by_category}

      def get(self,request,*args,**kwargs):
          self.params = self.request.GET
          criterias = self.params.getlist("sortBy");
          products = None;

          for criteria in criterias:      
              if criteria in self.sort_by.keys():
                   if not products:
                      products = self.sort_by.get(criteria)();
                   else:
                      products = self.sort_by.get(criteria)(products)

          data = PostSerializer(products,many=True);

          return JsonResponse({"data":data.data}, json_dumps_params={'ensure_ascii': False}) 

      
      def sort_by_price(self,obj=Product.objects):
          prices = [self.params.get("min"),self.params.get("max")]

          if prices[0].isdigit() and prices[1].isdigit():
             products_obj = obj.filter(price__lte=prices[1]).filter(price__gte=prices[0])  
             return products_obj
          else:
             return obj.all()[:5]


      def sort_by_category(self,obj=Product.objects):
          category = self.params.get("category")                    
          return obj.filter(category__iexact=category)


      def sort_by_brand(self,obj=Product.objects):
          brand = self.params.get("brand")                    
          return obj.filter(brand__iexact=brand)


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
