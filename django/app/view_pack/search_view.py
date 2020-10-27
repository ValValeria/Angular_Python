from django.http.response import JsonResponse
from django.views.generic import View;
from ..models import Product
import re
import requests
from ..functions import map_results,parse_page
import threading

class Search(View):
    response = {"errors":[],"results":[]}
    url = "https://search.rozetka.com.ua/search/api/v4/"

    def get(self,request,*args,**kw):
        search = request.GET.get("search")
        more = request.GET.get("isIncluded")
        result = re.match("[a-z]{2,10}", search)

        if result:
            products = list(Product.objects.filter(title__icontains=search).distinct().values())

            if len(products) and not more:
                self.response['results']=products
            else:
                response = requests.get(self.url,params={"text":search})
                sorted_data = []
                content = response.json()

                if response.status_code==200 :

                    if content["data"]["goods"]:
                       data=content["data"]["goods"][:6]
                    else:
                       data = self.find_more_result(search)
                
                    print(data)

                    if isinstance(data,list) and len(data)>0:
                          sorted_data = list(map(map_results,data))

                self.response["results"] = (sorted_data+products) if more else sorted_data
        else:
            self.response["errors"].append("Invalid token")

        return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False})

        

    def find_more_result(self,search):
        response = requests.get( "https://search.rozetka.com.ua/search/api/v4/autocomplete/?front-type=xl&text="+search+"&lang=ru")

        if response.status_code == 200 :
            data_json = response.json()
            records = data_json.get("data")["content"]["records"]
            
            if  not len(records):
                return []

            data = records.get("goods")

            if data:
                return data
            else: 
                data_records = records.get("cats_searches")
                id_list = list(map(lambda obj:obj["id"] ,data_records))
                result = [];

                for id in id_list:
                    thread = threading.Thread(target=parse_page,args=(id,result,))
                    thread.start()
                
                return result;
        else:
            return []
    
        
