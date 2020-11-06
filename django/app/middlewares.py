from json import dumps, loads
from django.contrib.auth import authenticate, login


class CorsMiddleware():
    def __init__(self, get_response):
        self.get_response = get_response


    def __call__(self, request):
        response = self.get_response(request)
        response["Access-Control-Allow-Origin"]="*"
        response["Access-Control-Allow-Method"]="*"
        response["Access-Control-Allow-Headers"]="*"
        return response
    

    def process_view(self,request, view_func, *view_args, **view_kwargs):
        auth_str = request.headers.get("auth");
        print(request.headers)
        try:
           auth = loads(auth_str) if auth_str else "{}"
           if auth.get("username") and auth.get("password"):
              user = authenticate(auth["username"],auth["password"])
              if user is not None:
                login(request,user)

        except Exception:pass 
        return None
        
