from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Order, Restaurant

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
        # Lookup or create the Restaurant object
        restaurant, _ = Restaurant.objects.get_or_create(name=restaurant_name)
        
        # Save UserProfile with actual Restaurant ForeignKey
        UserProfile.objects.create(user=user, restaurant=restaurant)
        return user
    
class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['name', 'address', 'location_lat', 'location_lng']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'platform', 'customer_name', 'item_count', 'total_cost', 'eta', 'status', 'driver_lat', 'driver_lng', 'created_at']
