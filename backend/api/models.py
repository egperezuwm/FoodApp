from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # User and Userprofile will depend on each other
    restaurant_name = models.CharField(max_length=100)