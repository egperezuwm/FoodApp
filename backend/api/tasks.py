from .models import Order
from django.utils import timezone

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