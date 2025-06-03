from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import MoodEntry
from .serializers import MoodEntrySerializer
from datetime import date

class MoodEntryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
      print("🔥 request.user:", request.user)
      today = date.today()
      # 이미 오늘 기록이 있는지 확인
      if MoodEntry.objects.filter(user=request.user, created_at=today).exists():
          return Response({'error': '오늘은 이미 감정을 기록했습니다.'}, status=400)

      serializer = MoodEntrySerializer(data=request.data)
      if serializer.is_valid():
          serializer.save(user=request.user)
          return Response(serializer.data, status=201)
      return Response(serializer.errors, status=400)

