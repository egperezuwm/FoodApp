from .models import Order
from django.utils import timezone
from faker import Faker # for generating orders
import requests
from math import cos, radians


def update_order_etas():
    print(">>> Scheduler triggered")

    orders = Order.objects.filter(status='pending')
    print(f">>> Found {orders.count()} pending orders")

    for order in orders:
        route = order.route or []
        if len(route) <= 1:
            continue  # already at or near the restaurant

        # Move to next point
        route.pop(0)
        next_lng, next_lat = route[0]
        print(f"Moving Order {order.id} to: {next_lat}, {next_lng} | Remaining route: {len(route)}")

        order.driver_lat = next_lat
        order.driver_lng = next_lng
        order.route= route

        order.eta = get_eta(
            next_lat, next_lng,
            order.restaurant.location_lat, order.restaurant.location_lng
        )

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

def generate_random_coordinates_near_restaurant(restaurant, radius_km=4.0, precision=10):
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
    try:
        url = f"http://router.project-osrm.org/nearest/v1/driving/{lng},{lat}"
        response = requests.get(url, timeout=2)
        data = response.json()
        if data.get('code') == 'Ok':
            snapped_lng, snapped_lat = data['waypoints'][0]['location']
            return round(snapped_lat, precision), round(snapped_lng, precision)
    except Exception as e:
        print(f"[OSRM] Snap error: {e}")
    
    # fallback to rounded input
    return round(lat, precision), round(lng, precision)

def get_eta(lat, lng, dest_lat, dest_lng):
    try:
        url = f"http://router.project-osrm.org/route/v1/driving/{lng},{lat};{dest_lng},{dest_lat}?overview=false"
        response = requests.get(url, timeout=2)
        data = response.json()
        if data.get('code') == 'Ok':
            duration_sec = data['routes'][0]['duration']
            return int(round(duration_sec / 60))  # convert to minutes
    except Exception as e:
        print(f"[OSRM ETA] Error: {e}")
    
    return 10  # fallback ETA

def get_route(start_lat, start_lng, end_lat, end_lng):
    url = f"http://router.project-osrm.org/route/v1/driving/{start_lng},{start_lat};{end_lng},{end_lat}?overview=full&geometries=geojson"
    response = requests.get(url, timeout=2)
    data = response.json()
    if data.get('code') == 'Ok':
        return data['routes'][0]['geometry']['coordinates']  # list of [lng, lat]
    return []