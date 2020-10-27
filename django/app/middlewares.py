from json import dumps
from django.contrib.auth import authenticate, login


class CorsMiddleware():
    def __init__(self, get_response):
        self.get_response = get_response


    def __call__(self, request):
        response = self.get_response(request)
        response["Access-Control-Allow-Origin"]="*"
        response["Access-Control-Allow-Methods"]="*"
        response["Access-Control-Allow-Headers"]="*"
        return response
    

    def process_view(self,request, view_func, *view_args, **view_kwargs):
        auth_str = request.headers.get("Auth")

        auth = dumps(auth_str) if auth_str else {}
        
        if isinstance(auth,dict) and hasattr(auth,"username") and hasattr(auth,"password"):
            user = authenticate(auth["username"],auth["password"])
            if user:
                login(request,user)

        return None
        
