from django.apps import AppConfig
import os

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        if os.environ.get('RUN_MAIN') != 'true':
            return  # Prevents APScheduler from running twice in dev

        # AVOID CIRCULAR IMPORTS:
        from apscheduler.schedulers.background import BackgroundScheduler
        from .tasks import update_order_etas

        scheduler = BackgroundScheduler()
        scheduler.add_job(update_order_etas, 'interval', minutes=1)
        scheduler.start()