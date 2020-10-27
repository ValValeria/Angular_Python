from django.db import models;
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def image_extension(file):
    if not "image/" in file.content_type:
        raise ValidationError(
            _('%(value)s is not an image'),
            params={'value': file.name},
        )


class Product(models.Model):
	  title = models.CharField(max_length=30)
	  price = models.IntegerField()
	  short_description = models.CharField("Excerpt",max_length=200,help_text="Excerpt")
	  count = models.IntegerField(default=20)
	  image = models.FileField(upload_to="app/static/images",blank=True,validators=[image_extension])
	  long_description = models.TextField("Description",max_length=600,blank=True,help_text="Description")
	  brand = models.CharField(max_length=20,blank=True)
	  status = models.CharField(choices=[("limited","limited"),("unlimited","unlimited")],default="unlimited",max_length=9)

#python manage.py makemigrations
#python manage.py migrate
