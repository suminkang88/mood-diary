from django.urls import path
from .views import MoodEntryView

urlpatterns = [
    path('entries/', MoodEntryView.as_view()),
]
