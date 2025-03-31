from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class SignupSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'restaurant_name']

    def create(self, validated_data):
        restaurant_name = validated_data.pop('restaurant_name')
        # create default django user:
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        # Then create the UserProfile that has custom data, like restaurant name:
        UserProfile.objects.create(user=user, restaurant_name=restaurant_name)
        return user