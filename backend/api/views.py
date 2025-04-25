from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
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
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # If status is changing to complete, set completed_at timestamp
        if 'status' in request.data:
            if request.data['status'] == 'complete':
                instance.completed_at = timezone.now()
            elif request.data['status'] == 'pending':
                instance.completed_at = None
                
        self.perform_update(serializer)
        return Response(serializer.data)

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
        
class UpdateRestaurantLocation(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        profile = UserProfile.objects.get(user=request.user)
        restaurant = profile.restaurant

        location_lat = request.data.get('location_lat')
        location_lng = request.data.get('location_lng')

        if location_lat is not None and location_lng is not None:
            restaurant.location_lat = location_lat
            restaurant.location_lng = location_lng
            restaurant.save()
            return Response({"message": "Location updated"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid coordinates"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([])  # Remove all permission checks
@authentication_classes([])  # Remove all auth checks
def RestaurantList(request):
    restaurants = Restaurant.objects.all().order_by('name')
    serializer = RestaurantSerializer(restaurants, many=True)
    return Response(serializer.data)

class OrderAnalytics(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            restaurant = request.user.userprofile.restaurant
            
            # Total orders
            total_orders = Order.objects.filter(restaurant=restaurant).count()
            
            # Completed orders
            completed_orders = Order.objects.filter(restaurant=restaurant, status='complete').count()
            
            # Average bill amount
            from django.db.models import Avg, Count, Sum
            
            avg_bill = Order.objects.filter(restaurant=restaurant).aggregate(avg=Avg('total_cost'))
            
            # Platform distribution
            platform_distribution = Order.objects.filter(restaurant=restaurant).values('platform').annotate(
                count=Count('id'),
                percentage=Count('id') * 100.0 / total_orders if total_orders > 0 else 0
            )
            
            # Orders by hour (for time of day analysis)
            from django.db.models.functions import ExtractHour
            
            orders_by_hour = Order.objects.filter(restaurant=restaurant).annotate(
                hour=ExtractHour('created_at')
            ).values('hour').annotate(count=Count('id')).order_by('hour')
            
            # Average items per order
            avg_items = Order.objects.filter(restaurant=restaurant).aggregate(avg=Avg('item_count'))
            
            # Revenue data (total and by platform)
            total_revenue = Order.objects.filter(restaurant=restaurant).aggregate(sum=Sum('total_cost'))
            
            revenue_by_platform = Order.objects.filter(restaurant=restaurant).values('platform').annotate(
                revenue=Sum('total_cost')
            )
            
            return Response({
                'total_orders': total_orders,
                'completed_orders': completed_orders,
                'completion_rate': (completed_orders / total_orders * 100) if total_orders > 0 else 0,
                'avg_bill_amount': avg_bill['avg'],
                'platform_distribution': list(platform_distribution),
                'orders_by_hour': list(orders_by_hour),
                'avg_items_per_order': avg_items['avg'],
                'total_revenue': total_revenue['sum'],
                'revenue_by_platform': list(revenue_by_platform)
            })
            
        except Exception as e:
            print("ANALYTICS ERROR:", e)
            return Response({"error": str(e)}, status=400)
