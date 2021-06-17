from django.shortcuts import redirect
from .classes.UserParser import UserParser
from urllib import request
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage, Storage, get_storage_class
from .serializers.post_serializer import PostSerializer
from django.http.response import FileResponse, Http404, HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound, HttpResponseServerError
from django.views.generic import ListView, View
import os
from .models import Avatar, Letter, Product, UserData
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from .forms import AuthenticateForm, LetterForm
from django.contrib.auth.models import Permission, User
from django.contrib.contenttypes.models import ContentType
from django.db.models import Max, Min
from django.core.paginator import Paginator
from .view_pack.likes_view import ProductLikesShow, ProductLikes, ProductLikesDelete
from django.db.models import Q
from django.core.files import File
from datetime import datetime


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
            if request.GET.get(criteria):
                if products is None:
                    products = self.sort_by.get(criteria)()
                else:
                    products = self.sort_by.get(criteria)(products)

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


class LoginView(View):
    response = {"data": {"user": {}}, "status": ""}
    form = AuthenticateForm

    def post(self, *args, **kwargs):
        form = self.form(self.request.POST, True)
        if form.is_valid():
            user = User.objects.filter(username=form.cleaned_data['username']).filter(
                password=form.cleaned_data['password'])

            if user.exists():
                login(self.request, user.first())
                self.response["data"]["user"].update(
                    UserParser(user.first()).get_user())
                self.response["status"] = "user"

                return JsonResponse(self.response)
            else:
                self.response["status"] = "guest"
        else:
            self.response['errors'] = ["Invalid data"]

        return JsonResponse(self.response)


class ChangeAvatar(View):
    redirect_authenticated_user = True
    response = {"errors": [], "data": {"url": ""}, "status": ""}

    def post(self, request, *args, **kw):
        user = request.user
        file = request.FILES.get('avatar')

        if not file or not user.is_authenticated:
            return HttpResponseForbidden()

        if file:
            if "image/" in file.content_type:
                if not user.avatar:
                    user.avatar = Avatar.objects.create(user=user)
                user.avatar.photo.save(file.name, file, save=False)
                user.avatar.save()
                user.save()
                self.response["status"] = "ok"
                self.response["data"]["url"] = user.avatar.photo.url
            else:
                self.response["errors"]

            return JsonResponse(self.response)
        else:
            return Http404()


class SignUpView(View):
    form = AuthenticateForm
    response = {"errors": [], "messages": [], "data": {}}

    def post(self, request, *args, **kwargs):
        form = self.form(self.request.POST, True)

        if form.is_valid() and not request.user.is_authenticated:
            user = User.objects.filter(Q(username=form.cleaned_data['username']) | Q(
                email=form.cleaned_data["email"])).first()

            if not user:
                f = open(r"./app/static/avatars/blank.jpg", 'rb')
                file = File(f)
                user = User.objects.create(
                    username=form.cleaned_data["username"], email=form.cleaned_data["email"], password=form.cleaned_data["password"])
                user.avatar = Avatar(user=user)
                user.avatar.photo.save("blank.jpg", file, save=False)
                user_data = UserData.objects.create(status="user", user=user)
                user.userdata = user_data
                user.save()

                self.response["data"].update(
                    {"user": UserParser(user).get_user()})
                self.response['status'] = "user"
            else:
                self.response["errors"].append(
                    "Пользователь с такой почтой или именем уже есть")
        else:
            self.response['errors'] = list(form.errors)
        return JsonResponse(self.response)



class UserProfile(View):
    response={"errors":[],"data":{},"status":""}

    def get(self,request,*args,**kw):
        user_id = request.GET.get("user_id");
        user = request.user

        if not user.is_authenticated or not user_id==user.id:
            return HttpResponseForbidden();

        self.response["data"].update({"user":UserParser(user).get_user()})

        self.response["status"]="user"

        return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False});


class SendLetter(View):
    form = LetterForm

    def post(self, request, *args, **kw):
        form = self.form(request.POST)

        if form.is_valid():
            letter = Letter(
                email=form.cleaned_data["email"], cause=form.cleaned_data["cause"], message=form.cleaned_data["message"])
            letter.date = "2020-11-10"
            letter.ip = request.META["REMOTE_ADDR"]
            letter.save()
            return JsonResponse({"status": "ok"})
        else:
            return JsonResponse(form.errors)


class DeleteUser(View):
    def get(self, request, *args, **kw):
        if request.user.is_authenticated:
            request.user.delete()
            return HttpResponse()
        else:
            return HttpResponseForbidden()



class NotFound(View):

    def dispatch(self, request, *args, **kwargs):
        ext = os.path.splitext(request.path)[1]
        header = request.headers.get('sec-fetch-dest')

        if request.method == "GET" and header == "document":
            if request.accepts('text/html') and not ext:
               path = os.path.join("app", "static", "html")
               path = os.path.abspath(path)
               return FileResponse(open(os.path.join(path, "index.html"), 'rb'))
            else:
               url = "/app/static"+ request.path;
               return redirect(url)

        return HttpResponseNotFound()
