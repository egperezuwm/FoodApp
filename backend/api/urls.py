# accounts/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import dashboard, Signup, OrderViewSet, UpdateRestaurant, GenerateOrder

router = DefaultRouter()
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('dashboard/', dashboard.as_view(), name='dashboard'),
    path('signup/', Signup.as_view(), name='signup'),
    path('update-restaurant/', UpdateRestaurant.as_view(), name='update-restaurant'),
    path('generate-order/', GenerateOrder.as_view(), name='generate-order'),
    path('', include(router.urls)),  # in order to update orders via double-click
]
