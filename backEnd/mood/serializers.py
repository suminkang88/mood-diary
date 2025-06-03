from rest_framework import serializers
from .models import MoodEntry

class MoodEntrySerializer(serializers.ModelSerializer):
  class Meta:
    model = MoodEntry
    fields = ['id','emoticon', 'memo','created_at']
    read_only_fields = ['id', 'created_at'] #post할 때 이 필드 무시