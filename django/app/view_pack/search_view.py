from django.http.response import JsonResponse
from django.views.generic import View;
from ..models import Product
import re


class Search(View):
    response = {"errors":[],"results":[]}

    def get(self,request,*args,**kw):
        search = request.GET.get("search")
        result = re.match("[a-z]{2,10}", search)

        if result:
            products = list(Product.objects.filter(title__icontains=search).distinct().values())

            if len(products):
                self.response['results']=products
        else:
            self.response["errors"].append("Invalid token")

        return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False})

        

        
