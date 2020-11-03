from typing import Any
from django.http.request import HttpRequest
from django.http.response import HttpResponse, HttpResponseForbidden
from django.views.generic import ListView,DetailView,View;
from app.models import Product;
from django.http import JsonResponse;
from django.contrib.auth import authenticate,login
from app.forms import AuthenticateForm
from .view_pack.search_view import Search;
from .functions import parse_page

class ProductsView(ListView):
      def get(self, *args, **kwargs):
          products = list(Product.objects.all().values())
          response =  JsonResponse(products, safe=False, json_dumps_params={'ensure_ascii': False})
          return response


class ProductView(ListView):

      def get(self, request, *args, **kwargs):
          product = Product.objects.filter(id__contains=kwargs["pk"]);
          url = "http://rozetka.com.ua/"+"/".join(request.GET.getlist("tag"))
 
          if product.exists():
              return JsonResponse(product.values()[0])
          elif len(url)>10:
              return JsonResponse(parse_page(url),safe=False, json_dumps_params={'ensure_ascii': False})
          else :
              return HttpResponseForbidden()
            


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
              user = User.create_user(result.cleaned_data['username'],result.cleaned_data['email'],result.cleaned_data['password'])
              self.response['status']="user"
          else:
              self.response['errors']=form.errors
          return JsonResponse(self.response)
