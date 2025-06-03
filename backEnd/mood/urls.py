from django.urls import path
from .views import MoodEntryCreateView,MoodEntryListView

urlpatterns = [
    path('entries/', MoodEntryCreateView.as_view()), # POST
     path('entries/list/', MoodEntryListView.as_view()), # GET
]
