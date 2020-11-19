from json import  loads
from django.contrib.auth import  authenticate, login
import sys;

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

        try:
           auth = loads(auth_str)

           if "username" in auth and "password" in auth:
              user = authenticate(username=auth["username"],password=auth["password"]);
              if user is not None:
                 login(request,user)

        except Exception:
            print("Error has occured :"+ str(sys.exc_info()[0]))

        return None
        
#{"username":"sveta","password":"sveta10"}