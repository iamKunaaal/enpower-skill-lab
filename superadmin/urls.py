from django.urls import path
from . import views


urlpatterns = [
    
    path('dashboard/', views.dashboard, name='superadmin_dashboard'),
    path('onboard-school/', views.onboard_school, name='onboard_school'),
    path('schools/', views.school_list, name='school_list'),
    path('school/<int:school_id>/', views.view_school, name='view_school'),
    path('school/<int:school_id>/edit/', views.edit_school, name='edit_school'),
    path('school/<int:school_id>/delete/', views.delete_school, name='delete_school'),
    path('school-admins/', views.school_admin_list, name='school_admin_list'),
    path('school-admin/<int:admin_id>/', views.view_school_admin, name='view_school_admin'),
    path('school-admin/<int:admin_id>/edit/', views.edit_school_admin, name='edit_school_admin'),
    path('school-admin/<int:admin_id>/delete/', views.delete_school_admin, name='delete_school_admin'),
    path('onboard-school-admin/', views.onboard_school_admin, name='onboard_school_admin'),
    path('onboard-student/', views.onboard_student, name='onboard_student'),
    path('students/', views.student_list, name='student_list'),
    path('student/<int:student_id>/', views.view_student, name='view_student'),
    path('student/<int:student_id>/edit/', views.edit_student, name='edit_student'),
    path('student/<int:student_id>/delete/', views.delete_student, name='delete_student'),
    path('onboard-teacher/', views.onboard_teacher, name='onboard_teacher'),
    path('teachers/', views.teacher_list, name='teacher_list'),
    path('teacher/<int:teacher_id>/', views.view_teacher, name='view_teacher'),
    path('teacher/<int:teacher_id>/edit/', views.edit_teacher, name='edit_teacher'),
    path('teacher/<int:teacher_id>/delete/', views.delete_teacher, name='delete_teacher'),
    path('onboard-parent/', views.onboard_parent, name='onboard_parent'),
    path('parents/', views.parent_list, name='parent_list'),
    path('parent/<int:parent_id>/', views.view_parent, name='view_parent'),
    path('parent/<int:parent_id>/edit/', views.edit_parent, name='edit_parent'),
    path('parent/<int:parent_id>/delete/', views.delete_parent, name='delete_parent'),
    # Class Management URLs
    path('classes/', views.class_list, name='class_list'),
    path('add-class/', views.add_class, name='add_class'),
    path('class/<int:class_id>/edit/', views.edit_class, name='edit_class'),
    path('class/<int:class_id>/delete/', views.delete_class, name='delete_class'),
    # Lesson Management URLs
    path('lessons/', views.lesson_list, name='lesson_list'),
    path('add-lesson/', views.add_lesson, name='add_lesson'),
    path('lesson/<int:lesson_id>/', views.view_lesson, name='view_lesson'),
    path('lesson/<int:lesson_id>/edit/', views.edit_lesson, name='edit_lesson'),
    path('lesson/<int:lesson_id>/delete/', views.delete_lesson, name='delete_lesson'),
    path('api/search-schools/', views.search_schools, name='search_schools'),
    path('profile/', views.profile, name='superadmin_profile'),
    path('profile/update/', views.profile_update, name='superadmin_profile_update'),
    path('change-password/', views.change_password, name='superadmin_change_password'),
    path('logout/', views.superadmin_logout, name='superadmin_logout'),
    path('test-messages/', views.test_messages, name='test_messages'),  # Remove in production
]