from django.apps import AppConfig


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'


    # This method is called when the app is ready.
    def ready(self):
        # Import your signals to ensure they are registered with Django.
        import app.signals
