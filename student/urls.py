from django.urls import path
from . import views

app_name = 'student'

urlpatterns = [
    path('dashboard/', views.student_dashboard, name='student_dashboard'),
    path('profile/', views.student_profile, name='student_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/avatar/', views.update_avatar, name='update_avatar'),
]
