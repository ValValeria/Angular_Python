from django.views.generic import ListView,DetailView,View;
from app.models import Product;
from django.http import JsonResponse;
from json import dumps;
from django.views.generic.edit import FormView;
from django.contrib.auth import authenticate,login
from app.forms import AuthenticateForm


class ProductsView(ListView):
      def get(self, *args, **kwargs):
          products = list(Product.objects.all().values())
          response =  JsonResponse(products, safe=False, json_dumps_params={'ensure_ascii': False})
          return response


class ProductView(DetailView):
      model = Product


class LoginView(View):
      response = {}  
      form = AuthenticateForm;

      def post(self, *args, **kwargs):
          result = self.form(self.request.GET,True)    
          if self.form.is_valid() and not self.request.user.is_authenticated: 
              user = authenticate(form.cleaned_data['username'],form.cleaned_data['password'])
              if user is not None:
                  login(self.request,user)
                  response["status"]="user"
          else:
              response['errors']=["Invalid data"]

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
