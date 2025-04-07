from django.contrib import admin
from .models import UserProfile, Order, Restaurant

# Register your models here.
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'restaurant']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['platform', 'customer_name', 'item_count', 'total_cost', 'eta', 'status']
    list_filter = ['platform', 'status']
    search_fields = ['customer_name']
    ordering = ['-completed_at']  # the minus sign '-' puts the dates in descending order

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['name']