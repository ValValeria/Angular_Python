from django.views.generic import ListView
from django.core.paginator import Paginator
from django.http import *
from django.contrib.auth.models import User


class AdminUsers(ListView):
    response = {"data": {"users": []}, "errors": [], "status": ""}

    def get(self, request, *args, **kw):
        page = 1
        per_page = 4

        if request.GET.get("page"):
            page = request.GET.get("page")

        if request.GET.get("per_page"):
            per_page = request.GET.get("per_page")    

        if not page.isdigit() or not per_page.isdigit():
            return HttpResponseBadRequest()

        users = User.objects.all().order_by("id").values()
        paginator = Paginator(users, per_page)
        page_obj = paginator.page(page)

        self.response["data"]["users"] = list(page_obj.object_list)
        self.response["data"]["has_next"] = page_obj.has_next()
        self.response["data"]["has_prev"] = page_obj.has_previous()

        return JsonResponse(self.response)
