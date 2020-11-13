from django.core.paginator import Paginator
from ..serializers.comment_serializer import CommentSerializer
from django.contrib.auth.models import User
from ..models import Comment, Product
from ..forms import CommentForm
from django.contrib.auth.mixins import UserPassesTestMixin,PermissionRequiredMixin
from django.http.response import  JsonResponse;
from django.views.generic import ListView;
from json import loads;
import datetime
from django.shortcuts import get_object_or_404
import sys;


class Comment_View(UserPassesTestMixin,ListView,PermissionRequiredMixin):
      form = CommentForm
      response={"status":"","messages":[],"id":0}
      raise_exception = False
      redirect_authenticated_user=True

      def test_func(self):
          self.user = self.request.user;
          return self.user.is_authenticated;

      def post(self,request,*args,**kw):
          try:
              data = loads(request.body)
              form = self.form(data)
               
              if form.is_valid():
                  post = Product.objects.filter(id=form.cleaned_data["post_id"]);
              
                  if not post.exists():
                      self.response["messages"].append("Invalid post_id")
                      raise SyntaxError();
                  
                  post = post.first()
                  comment = Comment.objects.create(sender=self.user,message=form.cleaned_data["message"],post=post,date=str(datetime.date.today()))         
                  self.response["status"]="ok";
                  self.response["id"]=comment.id
              else:
                  self.response["messages"].append("Invalid data")

          except Exception as ex: 
              print(ex.__class__);
              print(ex)

          return JsonResponse(self.response);


class CommentList_View(ListView):
       response={"data":[]}
       per_page = 4

       def get(self,request,*args,**kw):
           obj = get_object_or_404(Product,pk=kw.get('post_id'));
           comments = obj.comment_set.select_related().order_by("id").all()
           page_count = request.GET.get("page","")

           if comments.exists() and page_count.isdigit():
               page_count = int(page_count)
               paginator = Paginator(comments,self.per_page)
               page = paginator.page(page_count)
               obj = CommentSerializer(page,many=True)
               self.response["data"]=obj.data;

           return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False})


        