from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.school_admin_dashboard, name='school_admin_dashboard'),
    path('logout/', views.school_admin_logout, name='school_admin_logout'),
    path('profile/', views.school_admin_profile, name='school_admin_profile'),
    path('profile/update/', views.school_admin_profile_update, name='school_admin_profile_update'),
    path('change-password/', views.school_admin_change_password, name='school_admin_change_password'),
]