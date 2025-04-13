from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Restaurant, UserProfile


class UserProfileModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )
        self.restaurant = Restaurant.objects.create(
            name="Test Restaurant"
        )
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            restaurant=self.restaurant
        )

    def test_user_profile_creation(self):
        """Test that a UserProfile object is created correctly."""
        self.assertEqual(self.user_profile.user, self.user)
        self.assertEqual(self.user_profile.restaurant, self.restaurant)

    def test_user_profile_str(self):
        """Test the string representation of the UserProfile model."""
        self.assertEqual(str(self.user_profile), "testuser")

    def test_user_profile_one_to_one(self):
        """Test that user is a one-to-one relationship."""
        with self.assertRaises(Exception):
            UserProfile.objects.create(user=self.user, restaurant=self.restaurant)

    def test_user_profile_cascade_delete(self):
        """Test that deleting a user deletes the associated UserProfile."""
        self.user.delete()
        self.assertFalse(UserProfile.objects.filter(id=self.user_profile.id).exists())

    def test_user_profile_restaurant_cascade(self):
        """Test that deleting a restaurant deletes the associated UserProfile."""
        self.restaurant.delete()
        self.assertFalse(UserProfile.objects.filter(id=self.user_profile.id).exists())