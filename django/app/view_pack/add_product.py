from django.http import JsonResponse
from django.views.generic import View
from app.forms import CreateProductForm
from app.forms import ValidateImages
from app.models import ProductImages


class AddProductView(View):
    # Under development
    response = {"errors": [], "data": {"url": ""}, "status": ""}

    def post(self, request, *args, **kwargs):
        form = CreateProductForm(request.POST)
        images = request.FILES.get("images")
        image_form = ValidateImages(images)

        if form.is_valid() and image_form.is_valid():
            product = form.save(commit=False)

            if len(images) > 1:
                first_image = images[0]
                product.image.save(first_image.name, first_image)

                for image in images:
                    product_images = ProductImages()
                    product_images.product = product;
                    product_images.image = image;
                    product_images.save()

                self.response["status"] = "ok";
            else:
                self.response["errors"].append("Invalid count of images")
        else:
            self.response["errors"] = form.errors;

        return JsonResponse(self.response)
