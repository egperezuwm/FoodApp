from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import status
from .serializers import SignupSerializer, OrderSerializer, RestaurantSerializer
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile, Order, Restaurant

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
        orders = Order.objects.filter(status=status_filter).order_by('-created_at' if status_filter == 'complete' else 'eta')
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