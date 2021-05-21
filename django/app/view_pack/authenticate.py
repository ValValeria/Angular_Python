from app.forms import AuthenticateForm
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.core.files import File
from django.db.models import Q
from django.http import JsonResponse
from app.classes.UserParser import UserParser
from django.views import View
from app.models import Avatar, UserData


class LoginView(View):
    response = {"data": {"user": {}}, "status": ""}
    form = AuthenticateForm

    def post(self, *args, **kwargs):
        form = self.form(self.request.POST, True)

        if self.request.user.is_authenticated:
            self.response['status'] = getattr(self.request.user, 'role', 'user')
            self.response["data"]["user"] = UserParser(self.request.user).get_user()

            return JsonResponse(self.response)

        if form.is_valid():
            user = User.objects.filter(Q(username=form.cleaned_data['username']) & Q(
                password=form.cleaned_data['password']))

            if user.exists():
                login(self.request, user.first())

                print(user.first())

                self.response["data"]["user"] = UserParser(user.first()).get_user()
                self.response["status"] = "user"
            else:
                self.response["status"] = "guest"
        else:
            self.response['errors'] = form.errors
        
        return JsonResponse(self.response)


class SignUpView(View):
    form = AuthenticateForm
    response = {"errors": [], "messages": [], "data": {}}

    def post(self, request, *args, **kwargs):
        form = self.form(request.POST, True)

        if request.user.is_authenticated:
            self.response['status'] = 'user'
        elif form.is_valid():
            user = User.objects.filter(Q(username=form.cleaned_data['username']) | Q(
                email=form.cleaned_data["email"])).first()

            if not user:
                f = open(r"./app/static/avatars/blank.jpg", 'rb')
                file = File(f)
                user = User.objects.create(
                    username=form.cleaned_data["username"], email=form.cleaned_data["email"],
                    password=form.cleaned_data["password"])
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
