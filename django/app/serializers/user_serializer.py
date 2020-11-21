from ..models import Avatar
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    id = serializers.IntegerField()

    class Meta:
        model= User
        fields=("username","id")