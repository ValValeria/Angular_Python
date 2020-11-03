import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup

def map_results(product):
    result = {}

    if isinstance(product,dict):
        result = {"id":product.get('id'),
              "title":product.get('title'),
              "price":product.get("price"),
              "status":product.get("status"),
              "img": product.get("image_main"),
              "href":list(filter(lambda x:x,urlparse(product.get("href")).path.split("/")))
              }
        
        description_fields=product.get("description_fields");
        
        if description_fields:
              result.update({
                  "short_description": list(product.get("description_fields").values())[0].get("go_value")
              })

    return result


def parse_page(id,queue):
    url = "https://xl-main-api.rozetka.com.ua/v3/sections/get?front-type=xl&sectionViewed=goods_ids="+str(id);
    print(url)
    response = requests.get(url)
    data = response.json()
    goods = data["data"]["sectionViewed"]['goods']
    
    if len(goods):
        section=goods[0]
        title = section["title"]
        href = section["brand"]["href"]
        short_discription = section["docket"]
        queue.append({"title":title,"href":urlparse(href).path,"short_discription":short_discription})
  


def parse_page(url):
    print(url)
    response = requests.get(url)
    result = {}

    if response.status_code == 200:
          text = response.text;
          soup = BeautifulSoup(text,'lxml')
          title = soup.select_one(".product__title")
          price = soup.select_one('.product-prices__big ')
          short_description = soup.select_one('.product-about__brief')
          long_description = soup.select_one('.product-about__description-content p')
          result.update({"title":title.text,"price":price.text,"short_description":short_description.text,"long_description":long_description.text})
    return result
          