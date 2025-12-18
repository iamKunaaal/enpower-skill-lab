from django.urls import path
from . import views


urlpatterns = [
    path('dashboard/', views.dashboard, name='superadmin_dashboard'),
    path('onboard-school/', views.onboard_school, name='onboard_school'),
    path('schools/', views.school_list, name='school_list'),
    path('school-admins/', views.school_admin_list, name='school_admin_list'),
    path('onboard-school-admin/', views.onboard_school_admin, name='onboard_school_admin'),
    path('onboard-student/', views.onboard_student, name='onboard_student'),
    path('students/', views.student_list, name='student_list'),
    path('student/<int:student_id>/', views.view_student, name='view_student'),
    path('student/<int:student_id>/edit/', views.edit_student, name='edit_student'),
    path('onboard-teacher/', views.onboard_teacher, name='onboard_teacher'),
    path('teachers/', views.teacher_list, name='teacher_list'),
    path('teacher/<int:teacher_id>/', views.view_teacher, name='view_teacher'),
    path('teacher/<int:teacher_id>/edit/', views.edit_teacher, name='edit_teacher'),
    path('api/search-schools/', views.search_schools, name='search_schools'),
    path('profile/', views.profile, name='superadmin_profile'),
    path('profile/update/', views.profile_update, name='superadmin_profile_update'),
    path('change-password/', views.change_password, name='superadmin_change_password'),
    path('logout/', views.superadmin_logout, name='superadmin_logout'),
    path('test-messages/', views.test_messages, name='test_messages'),  # Remove in production
]