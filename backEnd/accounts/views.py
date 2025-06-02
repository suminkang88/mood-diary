from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': '이미 존재하는 사용자입니다.'}, status=400)

    user = User.objects.create_user(username=username, password=password)

    # 회원가입 후 바로 JWT 발급
    refresh = RefreshToken.for_user(user)
    return Response({
        'message': '회원가입 성공',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }, status=201)