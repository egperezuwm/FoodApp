from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import status
from .serializers import SignupSerializer
from rest_framework.permissions import IsAuthenticated


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
        user = request.user.username
        orders_today = 10
        total_revenue = 250.75
        pending_orders = 3

        orders = [
            {
                "id": 1,
                "customerName": "Jimmy Neutron",
                "itemCount": 3,
                "price": 47.82,
                "eta": "Arriving",
                "platform": "DoorDash"
            },
            {
                "id": 2,
                "customerName": "Sheen Estevez",
                "itemCount": 1,
                "price": 19.53,
                "eta": "7 min",
                "platform": "UberEats"
            },
            {
                "id": 3,
                "customerName": "Cindy Vortex",
                "itemCount": 14,
                "price": 113.19,
                "eta": "12 min",
                "platform": "DoorDash"
            }
        ]

        drivers = [
            {"id": 1, "customerName": "Jimmy Neutron", "location": [43.03, -87.92]},
            {"id": 2, "customerName": "Sheen Estevez", "location": [43.04, -87.91]}
        ]

        customers = [
            {"id": 1, "name": "Jimmy Neutron", "location": [43.05, -87.90]},
            {"id": 2, "name": "Sheen Estevez", "location": [43.06, -87.89]}
        ]

        return Response({
            "user": user,
            "total_revenue": total_revenue,
            "pending_orders": pending_orders,
            "orders": orders,
            "drivers": drivers,
            "customers": customers
        })