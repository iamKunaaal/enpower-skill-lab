from django.urls import path
from . import views

from django.urls import path
from . import views

urlpatterns = [
    path('', views.school_home, name='school_home'),
]