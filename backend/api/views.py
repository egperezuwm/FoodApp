from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import status
from .serializers import SignupSerializer, OrderSerializer, RestaurantSerializer
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile, Order, Restaurant
from django.utils import timezone # for generating orders
import random
from .tasks import generate_customer_name, generate_random_coordinates_near_restaurant, get_eta, get_route


class Signup(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        print("Signup Error:", serializer.errors) # added when Restaurant Model was instituted
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class dashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            restaurant = request.user.userprofile.restaurant
            restaurant_data = RestaurantSerializer(restaurant).data
        except Exception as e:
            print("DASHBOARD ERROR:", e)
            return Response({"error": str(e)}, status=400)
        
        status_filter = request.query_params.get('status', 'pending')
        
        pending_orders = Order.objects.filter(status="pending").count()
        completed_orders = Order.objects.filter(status="complete").count()
        orders = Order.objects.filter(restaurant=restaurant, status=status_filter).order_by('-created_at' if status_filter == 'complete' else 'eta')
        orders_serialized = OrderSerializer(orders, many=True).data

        return Response({
            "restaurant": restaurant_data,
            "pending_orders": pending_orders,
            "completed_orders": completed_orders,
            "orders": orders_serialized,
            "drivers": [],
            "customers": [],
        })
    
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class UpdateRestaurant(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            user_profile = request.user.userprofile
            restaurant = user_profile.restaurant
        except Exception as e:
            return Response({"error": "Restaurant not found for this user"}, status=400)

        serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class GenerateOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_profile = request.user.userprofile
            restaurant = user_profile.restaurant

            platform = random.choice(['DoorDash', 'UberEats', 'GrubHub'])
            customer_name = generate_customer_name()
            item_count = random.randint(1, 10)
            price_per_item = random.uniform(10, 20)  # realistic single-item cost so one item doesn't cost $30+
            total_cost = round(item_count * price_per_item, 2)
            lat, lng = generate_random_coordinates_near_restaurant(restaurant)
            eta = get_eta(lat, lng, restaurant.location_lat, restaurant.location_lng)
            route_coords = get_route(lat, lng, restaurant.location_lat, restaurant.location_lng)

            order = Order.objects.create(
                platform=platform,
                customer_name=customer_name,
                restaurant=restaurant,
                item_count=item_count,
                total_cost=total_cost,
                driver_lat=lat,
                driver_lng=lng,
                eta=eta,
                route = route_coords,
                status='pending',
                created_at=timezone.now()
            )
            print("✅ Order created:", order)
            return Response({'message': 'Order created', 'order_id': order.id}, status=201)

        except Exception as e:
            print("❌ Order creation failed:", str(e))  # This will show the REAL reason
            return Response({'error': str(e)}, status=500)