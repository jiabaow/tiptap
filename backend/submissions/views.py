from rest_framework import generics
from .models import Submission
from .serializers import SubmissionSerializer


class SubmissionListCreate(generics.ListCreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
