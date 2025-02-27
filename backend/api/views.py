# api/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    # Sample data; in a real app this might be a summary of orders, revenue, etc.
     user =  request.user.username
     orders_today = 10
     total_revenue = 250.75
     pending_orders = 3
     orders = [     # Example orders list
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
     drivers = [    # Example drivers list (lat, lon)
        {"id": 1, "customerName": "Jimmy Neutron", "location": [43.03, -87.92]},
        {"id": 2, "customerName": "Sheen Estevez", "location": [43.04, -87.91]}
    ]
     customers = [   # Example customers list (lat, lon)
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

