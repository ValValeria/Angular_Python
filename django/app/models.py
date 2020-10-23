from django.db import models


class Product(models.Model):
	  title = models.CharField(max_length=30)
	  price = models.IntegerField()
	  description = models.CharField("Excerpt",max_length=200,help_text="Excerpt")
	  count = models.IntegerField()
	  longDescr = models.CharField("Description",max_length=600,blank=True,help_text="Description")

#python manage.py makemigrations
#python manage.py migrate
