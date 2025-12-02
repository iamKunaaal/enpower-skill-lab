from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def school_home(request):
    return HttpResponse("Hello from school")