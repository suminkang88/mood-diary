from django.urls import path
from .views import MoodEntryCreateView,MoodEntryListView,Last7DaysStatsView

urlpatterns = [
    path('entries/', MoodEntryCreateView.as_view()), # POST
    path('entries/list/', MoodEntryListView.as_view()), # GET
    path('stats/last7days/', Last7DaysStatsView.as_view(), name='stats-last7days'),
]
