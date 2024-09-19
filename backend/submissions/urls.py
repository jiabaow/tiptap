from django.urls import path
from .views import SubmissionListCreate

urlpatterns = [
    path('submissions/', SubmissionListCreate.as_view(), name='submission-list-create'),
]