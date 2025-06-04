from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView
from .models import MoodEntry
from .serializers import MoodEntrySerializer
from datetime import timedelta, date
from django.utils.timezone import now, timedelta
from django.db.models import Count

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
        user = self.request.user

        # 모든 감정 기록 날짜 가져오기 (set으로 중복 제거)
        entries = (
            MoodEntry.objects
            .filter(user=user)
            .values_list("created_at", flat=True)
        )
        recorded_dates = set(entries)
        
        today = date(2025, 6, 11)  # ✅ 테스트용
        #today = today()
        collected = []
        for i in range(0, 100):  # 최대 일 100일전까지 탐색 (혹시 모를 유연함)
            current = today - timedelta(days=i)
            if current in recorded_dates:
                collected.append(current)
                if len(collected) == 7:  # ✅ 딱 7개까지만 수집!
                    break
            else:
                if collected:
                    break

        if not collected:
            return MoodEntry.objects.none()

        # 최종 필터링된 날짜들로 감정 기록 가져오기
        return (
            MoodEntry.objects
            .filter(user=user, created_at__in=collected)
            .order_by("-created_at")
        )

    
#가장 마지막 7일 연속 구간 기준 통계 정보 전달    
class Last7DaysStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        entries = (
            MoodEntry.objects
            .filter(user=user)
            .order_by("created_at")
            .values_list("created_at", flat=True)
            .distinct()
        )
        
        # 날짜 리스트 (오래된 순)
        dates = sorted(set([d for d in entries]))
        
        # 연속된 7일 구간 찾기 (뒤에서부터 탐색)
        for i in range(len(dates) - 7, -1, -1):  # ✅ 인덱스 오류 안 나게 수정
            window = dates[i:i+7]  # 연속된 7개 날짜 슬라이싱
            if all((window[j + 1] - window[j]).days == 1 for j in range(6)):
                start, end = window[0], window[6]
                break


        if not start:
            return Response({"error": "최근 7일 연속 기록이 존재하지 않습니다."}, status=400)
        
        # 통계 반환 (이제는 그 구간 내 감정 카운트)
        stats = (
            MoodEntry.objects
            .filter(user=user, created_at__range=[start, end])
            .values('emoticon')
            .annotate(count=Count('id'))
        )
        return Response({
            "start": start,
            "end": end,
            "data": list(stats)
        })