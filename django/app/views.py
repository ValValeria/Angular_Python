import os

from django.contrib.auth.mixins import LoginRequiredMixin
from .serializers.post_serializer import PostSerializer
from django.http.response import  Http404, HttpResponseBadRequest, HttpResponseForbidden
from django.views.generic import ListView,View;
from .models import Product;
from django.http import JsonResponse;
from django.contrib.auth import authenticate,login
from .forms import AuthenticateForm
from django.contrib.auth.models import Permission, User
from django.contrib.contenttypes.models import ContentType
from django.db.models import Max,Min
from django.core.paginator import Paginator
from .view_pack.likes_view import ProductLikesShow,ProductLikes;
from django.db.models import Q
from django.core.files import File


class ProductsView(ListView):
      response = {"data":[],"has_next":False}
      
      def get(self, *args, **kwargs):
          products = list(Product.objects.all())
          count = self.request.GET.get("page","");
          if count.isdigit() and len(count)>0:
               paginator = Paginator(products,4)
               count = int(count)

               if count<=paginator.num_pages:
                  page = paginator.page(count);
                  self.response["data"]=PostSerializer(page.object_list,many = True).data
                  self.response["has_next"]=page.has_next();

               return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False})

          return HttpResponseBadRequest()



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
          else:
              brand = list(Product.objects.distinct().all().values("brand"))

          brand = map(lambda v:v.get("brand"),brand)
          self.response["data"]["brands"]=list(brand);
          return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False})


class ProductView(ListView):

      def get(self, request, *args, **kwargs):
          product = Product.objects.filter(id__contains=kwargs["pk"]).first();
 
          if product:
              images = []
              product_serialized = PostSerializer(product).data 

              for obj in product.productimages_set.all():
                   images.append(obj.ex_photo.url);

              product_serialized.update({"ex_photoes":images})

              return JsonResponse({"data":product_serialized}, json_dumps_params={'ensure_ascii': False})
          else :
              return HttpResponseForbidden()



class ProductSort(ListView):
      params = None;
      per_page = 4
      response = {"data":[]}
      
      def __init__(self,*args):
          super().__init__(*args)
          self.sort_by = {"price":self.sort_by_price,"brand":self.sort_by_brand,"category":self.sort_by_category}

      def get(self,request,*args,**kwargs):
          self.params = self.request.GET
          page = request.GET.get("page","")
          products = None;

          if page.isdigit():
              page = int(page)
          else:
              page = 1

          for criteria in self.sort_by.keys():      
                if products is None:
                   products = self.sort_by.get(criteria)();
                else:
                   products = self.sort_by.get(criteria)(products)

          paginator = Paginator(products.order_by("id"),self.per_page);

          if page <=paginator.num_pages:
                data = PostSerializer(paginator.page(page).object_list,many=True);
                self.response["data"]=data.data

          return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False}) 

      
      def sort_by_price(self,obj=Product.objects):
          prices = [self.params.get("min"),self.params.get("max")]
          
          if prices[0].isdigit() and prices[1].isdigit():
             products_obj = obj.filter(Q(price__lte=prices[1])& Q(price__gte=prices[0])).order_by("price")
             return products_obj
          else:
             return obj.all()


      def sort_by_category(self,obj=Product.objects):
          category = self.params.get("category")   
          if category:                 
              return obj.filter(category__iexact=category)
          else:
              return obj.all()


      def sort_by_brand(self,obj=Product.objects):
          brand = self.params.get("brand")          
          if brand:          
             return obj.filter(brand__iexact=brand)
          else:
             return obj.all()


class LoginView(View):
      response = {}  
      form = AuthenticateForm;

      def post(self, *args, **kwargs):
          form = self.form(self.request.POST,True)    
          if form.is_valid(): 
              user = authenticate(username=form.cleaned_data['username'],password=form.cleaned_data['password'])
              if user is not None:
                  login(self.request,user)
                  self.response["status"]="user"
                  self.response["id"]=user.id
          else:
              self.response['errors']=["Invalid data"]

          return JsonResponse(self.response)



class ChangeAvatar(LoginRequiredMixin,View):
      redirect_authenticated_user=True
      response={"errors":[],"data":{},"status":""}
      
      def post(self,request,*args,**kw):
          user = request.user;
          file = request.FILES.get('avatar')
          
          if file:
              if "image/" in file.content_type:
                  user.avatar.photo = file;
                  user.save();
                  self.response["status"]=200
              else:
                  self.response["errors"]

              return JsonResponse(self.response)
          else:
              return Http404();


class SignUpView(View):
      form = AuthenticateForm;
      response = {}

      def setAvatar(self,user):
          with open(os.path.abspath("./static/avatars/blank.jpg"),"r") as f:
              file = File(f);
              user.photo = file;
              user.save()

      def post(self,request, *args, **kwargs):
          form = self.form(self.request.POST,True)    
          if form.is_valid() and not request.user.is_authenticated: 
              user = User.objects.filter(username=form.cleaned_data['username']).first()
              if not user:
                     user = User.objects.create_user(username=form.cleaned_data['username'],email=form.cleaned_data['email'],password=form.cleaned_data['password'])
                     self.setAvatar(user);
              self.response['status']="user";
              self.response["id"]=user.id
          else:
              self.response['errors']=form.errors
          return JsonResponse(self.response)


