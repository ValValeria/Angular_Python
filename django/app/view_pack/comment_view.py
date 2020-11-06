from django.contrib.auth.models import User
from app.models import Comment, Product
from app.forms import CommentForm
from django.contrib.auth.mixins import UserPassesTestMixin,PermissionRequiredMixin
from django.http.response import  JsonResponse;
from django.views.generic import View;
from json import dumps;
import datetime
from django.shortcuts import get_object_or_404



class Comment_View(UserPassesTestMixin,View,PermissionRequiredMixin):
      form = CommentForm
      response={"status":0,"messages":[],id:0}

      def test_func(self):
          self.user = self.request.user;
          return self.user.is_authenticated and self.user.has_perm("app.add_comments");

      def post(self,request,*args,**kw):
          try:
              data = dumps(request.body)
              form = self.form(initial=data)
               
              if form.is_valid():
                  post = Product.objects.first(id=form.cleaned_data["post_id"]);

                  if not post:
                      self.response["messages"].append("Invalid post_id")
                      raise Exception();

                  comment = Comment.objects.create(sender=self.user,message=post.get("message"),post=post,date=str(datetime.date.today()))         
                  self.response["status"]="ok";
                  self.response["id"]=comment.id
              else:
                  self.response["messages"].append("Invalid data")
                  raise SyntaxError()

          except Exception as ex:
              return JsonResponse(self.response);



class CommentList_View(View):
       response={"data":[]}

       def get(self,request,*args,**kw):
           obj = get_object_or_404(Product,pk=kw.get('post_id'));
           obj = list(obj.comment_set.all().select_related().values())
           self.response["data"].extend(obj);
           return JsonResponse(self.response,json_dumps_params={'ensure_ascii': False})


        