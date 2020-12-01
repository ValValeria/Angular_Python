from ..serializers.post_serializer import PostSerializer
from ..models import Favorite
from rest_framework import serializers


class FavoriteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField();
    product = PostSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields=("id","product")