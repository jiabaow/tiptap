from django.contrib import admin
from .models import Submission, Answer

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'user_answer', 'submitted_at')
    search_fields = ('question_text', 'user_answer')
    list_filter = ('submitted_at',)

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('text', 'correct')
    search_fields = ('text',)
    list_filter = ('correct',)

# Register your models here.
