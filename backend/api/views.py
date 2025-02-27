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
    data = {
         "user": request.user.username,
         "orders_today": 10,
         "total_revenue": 250.75,
         "pending_orders": 3,
    }
    return Response(data)
