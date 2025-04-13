from django.test import TestCase
from django.utils import timezone
from decimal import Decimal
from api.models import Restaurant, Order


class OrderModelTests(TestCase):
    def setUp(self):
        self.restaurant = Restaurant.objects.create(
            name="Test Restaurant"
        )
        self.order = Order.objects.create(
            platform="DoorDash",
            customer_name="John Doe",
            restaurant=self.restaurant,
            item_count=3,
            total_cost=Decimal("25.99"),
            eta=30,
            driver_lat=40.7128,
            driver_lng=-74.0060,
            status="pending"
        )

    def test_order_creation(self):
        """Test that an Order object is created correctly."""
        self.assertEqual(self.order.platform, "DoorDash")
        self.assertEqual(self.order.customer_name, "John Doe")
        self.assertEqual(self.order.restaurant, self.restaurant)
        self.assertEqual(self.order.item_count, 3)
        self.assertEqual(self.order.total_cost, Decimal("25.99"))
        self.assertEqual(self.order.eta, 30)
        self.assertEqual(self.order.driver_lat, 40.7128)
        self.assertEqual(self.order.driver_lng, -74.0060)
        self.assertEqual(self.order.status, "pending")
        self.assertIsNotNone(self.order.created_at)

    def test_order_str(self):
        """Test the string representation of the Order model."""
        self.assertEqual(str(self.order), "Doordash for John Doe")

    #Currently does not have the functionality
    # def test_order_platform_choices(self):
    #     """Test that platform field is limited to valid choices."""
    #     order = Order.objects.create(
    #         platform="UberEats",
    #         customer_name="Jane Doe",
    #         restaurant=self.restaurant,
    #         item_count=2,
    #         total_cost=Decimal("15.50"),
    #         eta=25
    #     )
    #     self.assertEqual(order.platform, "UberEats")
    #     with self.assertRaises(Exception):
    #         Order.objects.create(
    #             platform="InvalidPlatform",
    #             customer_name="Jane Doe",
    #             restaurant=self.restaurant,
    #             item_count=2,
    #             total_cost=Decimal("15.50"),
    #             eta=25
    #         )

    def test_order_status_default(self):
        """Test that status defaults to 'pending'."""
        order = Order.objects.create(
            platform="DoorDash",
            customer_name="Jane Doe",
            restaurant=self.restaurant,
            item_count=2,
            total_cost=Decimal("15.50"),
            eta=25
        )
        self.assertEqual(order.status, "pending")

    def test_order_driver_location_nullable(self):
        """Test that driver_lat and driver_lng can be null."""
        order = Order.objects.create(
            platform="DoorDash",
            customer_name="Jane Doe",
            restaurant=self.restaurant,
            item_count=2,
            total_cost=Decimal("15.50"),
            eta=25,
            driver_lat=None,
            driver_lng=None
        )
        self.assertIsNone(order.driver_lat)
        self.assertIsNone(order.driver_lng)

    def test_order_restaurant_cascade(self):
        """Test that deleting a restaurant deletes associated orders."""
        self.restaurant.delete()
        self.assertFalse(Order.objects.filter(id=self.order.id).exists())

    def test_order_total_cost_precision(self):
        """Test that total_cost respects max_digits and decimal_places."""
        order = Order.objects.create(
            platform="DoorDash",
            customer_name="Jane Doe",
            restaurant=self.restaurant,
            item_count=2,
            total_cost=Decimal("999999.99"),  # Max allowed
            eta=25
        )
        self.assertEqual(order.total_cost, Decimal("999999.99"))
        with self.assertRaises(Exception):
            Order.objects.create(
                platform="DoorDash",
                customer_name="Jane Doe",
                restaurant=self.restaurant,
                item_count=2,
                total_cost=Decimal("1000000.00"),  # Exceeds max_digits
                eta=25
            )

    def test_order_related_name(self):
        """Test the related_name 'orders' on Restaurant."""
        Order.objects.create(
            platform="UberEats",
            customer_name="Jane Doe",
            restaurant=self.restaurant,
            item_count=2,
            total_cost=Decimal("15.50"),
            eta=25
        )
        self.assertEqual(self.restaurant.orders.count(), 2)