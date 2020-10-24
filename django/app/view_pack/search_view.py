from django.http.response import JsonResponse
from django.views.generic import View;
from ..models import Product
import re
import requests

class Search(View):
    response = {"errors":[],"results":[]}
    url = "https://search.rozetka.com.ua/search/api/v4/"

    def get(self,request,*args,**kw):
        search = request.GET.get("search")
        pattern = "[a-z]{2,10}"
        result = re.match(pattern,search)

        if result:
            products = list(Product.objects.filter(title__icontains=search).distinct().values())

            if len(products):
                self.response['results']=products
            else:
                response = requests.get(self.url,params={"text":search})

                if response.status_code==200:
                    content=response.json()
                    self.response["results"]=content["data"]["goods"][:6]

        else:
            self.response["errors"].append("Invalid token")

        return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False})

        
        
    
        