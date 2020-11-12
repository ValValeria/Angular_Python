from django.db import models;
from django.contrib.auth.models import User


class Product(models.Model):
	title = models.CharField(max_length=30)
	price = models.IntegerField()
	short_description = models.CharField("Excerpt",max_length=200,help_text="Excerpt")
	count = models.IntegerField(default=20)
	image = models.FileField(upload_to="app/static/images")
	long_description = models.TextField("Description",max_length=600,blank=True,help_text="Description")
	brand = models.CharField(max_length=20,blank=True)
	category = models.CharField(choices=[("notebooks","notebooks"),("tv","tv")],default="unlimited",max_length=30)
	status = models.CharField(choices=[("limited","limited"),("unlimited","unlimited")],default="unlimited",max_length=9)
	rating = models.IntegerField(default=5,choices=[(1,1),(2,2),(3,3),(4,4),(5,5)]);  
	characterictics = models.TextField("Characteristics",max_length=300,blank=True,help_text="Используйте форму записи name:value;")
    
	def __str__(self):
          	return self.title;
    

class Order(models.Model):
	  user = models.ForeignKey(User,on_delete=models.CASCADE)
	  product = models.ForeignKey(Product,on_delete=models.CASCADE)
	  count = models.IntegerField(default=1)
	  status = models.CharField(choices=[(1,"Куплено"),(0,"Не куплено")],default="Не куплено",max_length=20)

	  def __str__(self):
    	    return self.product.title


class Comment(models.Model):
	  sender = models.ForeignKey(User,on_delete=models.CASCADE)
	  date = models.DateField()
	  message = models.CharField(max_length=300)
	  post=models.ForeignKey(Product,on_delete=models.CASCADE) 
	  rating = models.IntegerField(default=5,choices=[(1,1),(2,2),(3,3),(4,4),(5,5)])

class Favorite(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)

#python manage.py makemigrations
#python manage.py migrate
