from django.urls import path
from . import views

app_name = 'teacher'

urlpatterns = [
    path('dashboard/', views.teacher_dashboard, name='teacher_dashboard'),
    path('logout/', views.teacher_logout, name='teacher_logout'),
    path('profile/', views.teacher_profile, name='teacher_profile'),
    path('profile/update/', views.teacher_profile_update, name='teacher_profile_update'),
    path('change-password/', views.teacher_change_password, name='teacher_change_password'),
]
