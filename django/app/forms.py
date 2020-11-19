from django import forms
from django.core.exceptions import ValidationError


class AuthenticateForm(forms.Form):
    email = forms.EmailField(max_length=30,min_length=10,required=False)
    password = forms.CharField(max_length=30,min_length=10)
    username = forms.CharField(max_length=30,min_length=10)

    def __init__(self,form,isLogin=False):
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
    post_id=forms.IntegerField()
