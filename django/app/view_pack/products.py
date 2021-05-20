from app.serializers.post_serializer import PostSerializer
from django.http.response import FileResponse, Http404, HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.views.generic import ListView, View
from app.models import Avatar, Letter, Product, UserData
from django.http import JsonResponse
from django.db.models import Max, Min
from django.core.paginator import Paginator
from django.db.models import Q


class ProductsView(ListView):
    response = {"data": [], "has_next": False}

    def get(self, *args, **kwargs):
        products = list(Product.objects.all())
        count = self.request.GET.get("page", "")
        if count.isdigit() and len(count) > 0:
            paginator = Paginator(products, 4)
            count = int(count)

            if count <= paginator.num_pages:
                page = paginator.page(count)
                self.response["data"] = PostSerializer(
                    page.object_list, many=True).data
                self.response["has_next"] = page.has_next()

            return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False})

        return HttpResponseBadRequest()


class ProductInfo(ListView):
    response = {"data": []}

    def get(self, request, *args, **kw):
        products = None
        cat = request.GET.get("category", "")
        search = request.GET.get("search", "")

        if cat:
            products = Product.objects.filter(category__icontains=cat)
        elif search:
            products = Product.objects.filter(Q(title__icontains=search) | Q(
                category__contains=search) | Q(short_description__contains=search)).distinct()
        else:
            products = Product.objects

        categories = map(lambda obj: obj.get("category"),
                         products.distinct().all().values("category"))
        max_price = Product.objects.aggregate(max_price=Max("price"))
        min_price = Product.objects.aggregate(min_price=Min("price"))
        self.response["data"] = {"categories": list(categories), "price": [
            min_price, max_price]}
        return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False})


class ProductInfoBrands(ListView):
    response = {"data": {}}

    def get(self, request, *args, **kw):
        category = request.GET.get("category")

        if category.isalpha() and len(category):
            brand = list(Product.objects.filter(
                category=category).distinct().all().values("brand"))
        else:
            brand = list(Product.objects.distinct().all().values("brand"))

        brand = map(lambda v: v.get("brand"), brand)
        self.response["data"]["brands"] = list(brand)
        return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False})


class ProductAvailableCount(ListView):
    response = {"data": {}}

    def get(self, request, *args, **kw):
        product_id = request.GET.get('product_id', "")

        if product_id.isdigit():
            product = Product.objects.filter(id=product_id).first()
            self.response["data"] = {"count": product.count}
            return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False})
        else:
            return Http404()


class ProductView(ListView):

    def get(self, request, *args, **kwargs):
        product = Product.objects.filter(id__contains=kwargs["pk"]).first()

        if product:
            images = []
            product_serialized = PostSerializer(product).data

            for obj in product.productimages_set.all():
                images.append(obj.ex_photo.url)

            product_serialized.update({"ex_photoes": images})

            return JsonResponse({"data": product_serialized}, json_dumps_params={'ensure_ascii': False})
        else:
            return HttpResponseForbidden()


class ProductSort(ListView):
    params = None
    per_page = 4
    response = {"data": []}

    def __init__(self, *args):
        super().__init__(*args)
        self.sort_by = {"price": self.sort_by_price,
                        "brand": self.sort_by_brand, "category": self.sort_by_category}

    def get(self, request, *args, **kwargs):
        self.params = self.request.GET
        page = request.GET.get("page", "")
        search = request.GET.get("search", '')
        products = None

        if len(search):
            products = Product.objects.filter(Q(title__icontains=search) | Q(
                category__contains=search) | Q(short_description__contains=search)).distinct()

        if page.isdigit():
            page = int(page)
        else:
            page = 1

        for criteria in self.sort_by.keys():
            if criteria in request.GET:
                if products is None:
                    products = self.sort_by.get(criteria)()
                else:
                    products = self.sort_by.get(criteria)(products)

        if products:
            paginator = Paginator(products.order_by("id"), self.per_page)

            if page <= paginator.num_pages:
                data_page = paginator.page(page)
                data = PostSerializer(data_page.object_list, many=True)
                self.response["data"].extend(data.data)
                self.response["has_next"] = data_page.has_next()

        return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False})

    def sort_by_price(self, obj=Product.objects):
        prices = [self.params.get("min"), self.params.get("max")]

        if prices[0].isdigit() and prices[1].isdigit():
            products_obj = obj.filter(Q(price__lte=prices[1]) & Q(
                price__gte=prices[0])).order_by("price")
            return products_obj
        else:
            return obj.all()

    def sort_by_category(self, obj=Product.objects):
        category = self.params.get("category")
        if category:
            return obj.filter(category__iexact=category)
        else:
            return obj.all()

    def sort_by_brand(self, obj=Product.objects):
        brand = self.params.get("brand")
        if brand:
            return obj.filter(brand__iexact=brand)
        else:
            return obj.all()
