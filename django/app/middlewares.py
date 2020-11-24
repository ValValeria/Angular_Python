from json import  loads
from django.contrib.auth import   login
import sys
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.http.response import JsonResponse;


class CorsMiddleware():

    def __init__(self, get_response):
        self.get_response = get_response


    def __call__(self, request):
        response = self.get_response(request)
        response["Access-Control-Allow-Origin"]="*"
        response["Access-Control-Allow-Method"]="GET, POST, PUT, DELETE, PATCH, OPTIONS"
        response["Access-Control-Allow-Headers"]="*"
        return response

    def process_view(self,request, view_func, *view_args, **view_kwargs):
        auth_str = request.headers.get("Auth","{}");
        print(1)
        try:
           auth = loads(auth_str)
            
           if "username" in auth and "password" in auth:
              user = User.objects.filter(username=auth["username"]).filter(password=auth["password"]).first();
             
              if user :
                 login(request,user)
              print(user)
        except Exception:
            print("Error has occured :"+ str(sys.exc_info()[0]))

        return None
        
