from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView
from .models import MoodEntry
from .serializers import MoodEntrySerializer
from datetime import date

class MoodEntryCreateView(APIView):
    #permission_classes: 해당 view(API엔드포인트)에 어떤 사용자가 접근 가능한지를 지정하는 장치
    #IsAuthenticated(로그인한 사용자만 허용),IsAdminUser(관리자만 접근 가능) 등 여러 권한 클래스들이 있음
    #JWTAuthentication:user식별(=인증) / permission_classes: 식별된 user의 api호출 권한 확인 (=인가)
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
      today = date.today()
      # 이미 오늘 기록이 있는지 확인
      if MoodEntry.objects.filter(user=request.user, created_at=today).exists():
          return Response({'error': '오늘은 이미 감정을 기록했습니다.'}, status=400)

      serializer = MoodEntrySerializer(data=request.data)
      if serializer.is_valid():
          serializer.save(user=request.user)
          return Response(serializer.data, status=201)
      return Response(serializer.errors, status=400)

class MoodEntryListView(ListAPIView):
    #serializer_class: get_queryset으로 가져온 MoodEntry 객체들 -> JSON직렬화해서 반환
    serializer_class = MoodEntrySerializer
    permission_classes = [IsAuthenticated]
    
    #DB에서 사용자의 감정 목록을 가져옴
    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user).order_by('-created_at')