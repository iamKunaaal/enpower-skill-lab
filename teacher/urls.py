from django.urls import path
from . import views

app_name = 'teacher'

urlpatterns = [
    path('dashboard/', views.teacher_dashboard, name='teacher_dashboard'),
    path('logout/', views.teacher_logout, name='teacher_logout'),
    path('profile/', views.teacher_profile, name='teacher_profile'),
    path('profile/update/', views.teacher_profile_update, name='teacher_profile_update'),
    path('change-password/', views.teacher_change_password, name='teacher_change_password'),
    path('students/', views.student_list, name='student_list'),
    path('students/<int:student_id>/', views.view_student, name='view_student'),
    path('lessons/', views.lesson_library, name='lesson_library'),
    path('lessons/add/', views.add_lesson, name='add_lesson'),
    path('lessons/<int:lesson_id>/', views.view_lesson, name='view_lesson'),
    path('lessons/<int:lesson_id>/edit/', views.edit_lesson, name='edit_lesson'),
    path('lessons/delete/', views.delete_lessons, name='delete_lessons'),
]
