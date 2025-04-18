from .models import Order
from django.utils import timezone
from faker import Faker # for generating orders
import random           # for generating orders
from math import cos, radians


def update_order_etas():
    now = timezone.now()
    pending_orders = Order.objects.filter(status="pending")

    for order in pending_orders:
        if order.eta > 0:
            order.eta -= 1
            order.save()
        elif order.eta == 0:
            #order.status = "complete"
            #order.completed_at = now  // must double-click to mark as complete (frontend)
            order.save()

fake = Faker()

def generate_customer_name():
    return fake.name()

# generate map coordinates:
def get_bounds_from_center(lat, lng, distance_km=1.0):
    """
    Return min/max lat/lng that define a bounding box around (lat, lng)
    with ~`distance_km` in all directions.
    """
    # Latitude: 1 degree ≈ 111 km
    delta_lat = distance_km / 111.0
    # Longitude delta depends on latitude
    delta_lng = distance_km / (111.320 * cos(radians(lat)))

    return {
        "min_lat": lat - delta_lat, # south
        "max_lat": lat + delta_lat, # north
        "min_lng": lng - delta_lng, # west
        "max_lng": lng + delta_lng, # east
    }

def generate_random_coordinates_near_restaurant(restaurant, radius_km=3.0, precision=10):
    bounds = get_bounds_from_center(restaurant.location_lat, restaurant.location_lng, distance_km=radius_km)
    
    from random import uniform
    lat = uniform(bounds["min_lat"], bounds["max_lat"])
    lng = uniform(bounds["min_lng"], bounds["max_lng"])
    lat += uniform(-0.0001, 0.0001)
    lng += uniform(-0.0001, 0.0001)
    #return lat, lng
    return approximate_to_street_grid(lat, lng)

# in order to snap the coordinates to a street:
def approximate_to_street_grid(lat, lng, precision=4):
    return (round(lat, precision), round(lng, precision))