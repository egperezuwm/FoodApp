from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    location_lat = models.FloatField()
    location_lng = models.FloatField()

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # User and Userprofile will depend on each other
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username

class Order(models.Model):
    PLATFORM_CHOICES = [('DoorDash', 'DoorDash'), ('UberEats', 'UberEats')]
    STATUS_CHOICES = [('pending', 'pending'), ('complete', 'complete')]

    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    customer_name = models.CharField(max_length=50)
    restaurant = models.ForeignKey('Restaurant', on_delete=models.CASCADE, related_name='orders')

    item_count = models.PositiveIntegerField()
    total_cost = models.DecimalField(max_digits=8, decimal_places=2)    # dummy data (cannot show actual sales)
    eta = models.PositiveIntegerField()

    driver_lat = models.FloatField(null=True, blank=True)
    driver_lng = models.FloatField(null=True, blank=True)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.platform.title()} for {self.customer_name}"