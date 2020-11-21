from ..serializers.user_serializer import UserSerializer
from ..models import Comment
from rest_framework import serializers


class CommentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField();
    message = serializers.CharField();
    sender = UserSerializer(read_only=True)
    rating = serializers.IntegerField()

    class Meta:
        model = Comment
        fields=("id","message","sender","rating")
 