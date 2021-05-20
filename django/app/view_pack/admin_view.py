from django.contrib import admin
from django.views.generic import ListView, View;
from ..models import Product
from django.contrib.auth.mixins import UserPassesTestMixin
from django.shortcuts import render;


class AdminView(UserPassesTestMixin, ListView):
    template_name = "admin/index.html"
    model = Product
    redirect_field_name = "/"
    permission_denied_message = "You are not authenticated"

    def test_func(self):
        self.user = user = self.request.user;
        self.admin_data = admin.site.each_context(self.request)

        return admin.site.has_permission(self.request)

    def get_context_data(self, **kw):
        context = super().get_context_data(**kw)
        available_apps = self.admin_data.get("available_apps")
        context["models"] = available_apps[0].get("models");
        context.update(self.admin_data)

        if available_apps[1]:
            context["models"].extend(available_apps[1].get("models"))

        return context;


class AdminProductImages(ListView):
    template = "admin/products_images.html"

    def get(self, request, *args, **kw):
        return render(request, self.template)
