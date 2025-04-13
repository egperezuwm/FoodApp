from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import Restaurant


class RestaurantModelTests(TestCase):
    def setUp(self):
        self.restaurant = Restaurant.objects.create(
            name="Test Restaurant",
            address="123 Test St, City",
            location_lat=40.7128,
            location_lng=-74.0060
        )

    def test_restaurant_creation(self):
        """Test that a Restaurant object is created correctly."""
        self.assertEqual(self.restaurant.name, "Test Restaurant")
        self.assertEqual(self.restaurant.address, "123 Test St, City")
        self.assertEqual(self.restaurant.location_lat, 40.7128)
        self.assertEqual(self.restaurant.location_lng, -74.0060)

    def test_restaurant_str(self):
        """Test the string representation of the Restaurant model."""
        self.assertEqual(str(self.restaurant), "Test Restaurant")

    def test_restaurant_default_values(self):
        """Test default values for latitude and longitude."""
        restaurant = Restaurant.objects.create(name="Default Restaurant")
        self.assertEqual(restaurant.location_lat, 42.9744)
        self.assertEqual(restaurant.location_lng, 87.938)

    def test_restaurant_name_max_length(self):
        """Test that name field respects max_length."""
        max_length = Restaurant._meta.get_field('name').max_length
        long_name = "A" * (max_length + 1)
        restaurant = Restaurant(name=long_name)
        with self.assertRaises(ValidationError):
            restaurant.full_clean()  # Trigger validation

    def test_restaurant_address_blank(self):
        """Test that address can be blank."""
        restaurant = Restaurant.objects.create(name="No Address Restaurant")
        self.assertEqual(restaurant.address, "")