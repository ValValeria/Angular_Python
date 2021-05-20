from django.shortcuts import redirect
from .classes.UserParser import UserParser
from django.http.response import FileResponse, Http404, HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound
from django.views.generic import View
import os
from .models import Avatar, Letter
from django.http import JsonResponse
from .forms import LetterForm


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


class UserProfile(View):
    response = {"errors": [], "data": {}, "status": ""}

    def get(self, request, *args, **kw):
        user_id = request.GET.get("user_id");
        user = request.user

        if not user.is_authenticated or not user_id == user.id:
            return HttpResponseForbidden();

        self.response["data"].update({"user": UserParser(user).get_user()})

        self.response["status"] = "user"

        return JsonResponse(self.response, json_dumps_params={'ensure_ascii': False});


class SendLetter(View):
    form = LetterForm

    def post(self, request, *args, **kw):
        form = self.form(request.POST)

        if form.is_valid():
            letter = Letter(
                email=form.cleaned_data["email"], cause=form.cleaned_data["cause"],
                message=form.cleaned_data["message"])
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

        if request.headers.get('Host') == "localhost:4200":
            return HttpResponseBadRequest();

        if request.method == "GET":
            if request.accepts('text/html') and not ext:
                path = os.path.join("app", "static", "html")
                path = os.path.abspath(path)
                return FileResponse(open(os.path.join(path, "index.html"), 'rb'))
            else:
                url = "/app/static" + request.path;
                return redirect(url)
        return HttpResponseNotFound()
