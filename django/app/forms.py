from django import forms
from django.core.exceptions import ValidationError
from django.forms import ModelForm
from app.models import Product


class ValidateImages(forms.Form):
    images = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))

    def clean_images(self):
        images = self.images

        for image in images:
            if "image/" not in image.content_type:
                raise ValidationError("Invalid type of file", code="invalid")


class CreateProductForm(ModelForm):
    class Meta:
        model = Product
        fields = ['title', 'price', 'short_description',
                  'count', 'long_description',
                  'brand', 'category', 'status', 'rating',
                  'characterictics'
                  ]


class AuthenticateForm(forms.Form):
    email = forms.EmailField(max_length=30, min_length=10, required=False)
    password = forms.CharField(max_length=30, min_length=10)
    username = forms.CharField(max_length=30, min_length=10)

    def __init__(self, form, isLogin=False):
        self.isLogin = isLogin
        super().__init__(form)

    def clean_email(self):
        email = self.cleaned_data['email']

        if not self.isLogin:
            raise ValidationError("Invalid email")

        return email


class CommentForm(forms.Form):
    rating = forms.IntegerField()
    message = forms.CharField(max_length=300)
    post_id = forms.IntegerField()


class LetterForm(forms.Form):
    email = forms.EmailField(max_length=30, min_length=10)
    message = forms.CharField(max_length=300, min_length=10)
    cause = forms.CharField(max_length=50)
