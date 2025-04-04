from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import status
from .serializers import SignupSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile, Order


class Signup(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class dashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user.userprofile.restaurant_name
        except Exception as e:
            return Response({"error": "UserProfile not found for this user."}, status=400)
        
        pending_orders = Order.objects.filter(status="pending").count()
        orders = Order.objects.filter(status="pending").order_by('eta')
        orders_serialized = OrderSerializer(orders, many=True).data

        return Response({
            "user": user,
            "pending_orders": pending_orders,
            "orders": orders_serialized,
            "drivers": [],
            "customers": [],
        })