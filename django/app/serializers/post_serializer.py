from ..models import Product
from rest_framework import serializers


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields=("id","title","price",
               "short_description",
               "count","image","brand",
               "category","rating","image",
               "characterictics","long_description")
 