from django.db import models
from django.contrib.auth.models import User

class MoodEntry(models.Model):
    EMOTICON_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('neutral', 'Neutral'),
        # 추가 가능
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    emoticon = models.CharField(max_length=20, choices=EMOTICON_CHOICES)
    memo = models.TextField(blank=True)
    created_at = models.DateField() #for test: auto_now_add=True 잠시 제거.

    class Meta:
        unique_together = ('user', 'created_at')
