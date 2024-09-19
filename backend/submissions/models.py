from django.db import models


class Answer(models.Model):
    text = models.CharField(max_length=255)
    correct = models.BooleanField(default=False)


class Submission(models.Model):
    question_text = models.CharField(max_length=255)
    answers = models.ManyToManyField(Answer)
    user_answer = models.CharField(max_length=255)
    submitted_at = models.DateTimeField(auto_now_add=True)
