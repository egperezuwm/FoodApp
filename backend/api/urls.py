# accounts/urls.py
from django.urls import path
from .views import dashboard, Signup

urlpatterns = [
    path('dashboard/', dashboard.as_view(), name='dashboard'),
    path('signup/', Signup.as_view(), name='signup'),
]
