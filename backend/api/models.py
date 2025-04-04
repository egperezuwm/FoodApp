from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # User and Userprofile will depend on each other
    restaurant_name = models.CharField(max_length=100)

class Order(models.Model):
    PLATFORM_CHOICES = [('DoorDash', 'DoorDash'), ('UberEats', 'UberEats')]

    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    customer_name = models.CharField(max_length=50)
    item_count = models.PositiveIntegerField()
    total_cost = models.DecimalField(max_digits=8, decimal_places=2)    # dummy data
    eta = models.PositiveIntegerField()
    status = models.CharField(max_length=50, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.platform.title()} for {self.customer_name}"