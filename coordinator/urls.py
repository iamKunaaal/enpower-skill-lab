from django.urls import path
from . import views

app_name = 'coordinator'

urlpatterns = [
    path('dashboard/', views.coordinator_dashboard, name='coordinator_dashboard'),
    path('profile/', views.coordinator_profile, name='coordinator_profile'),
    path('change-password/', views.coordinator_change_password, name='coordinator_change_password'),
    path('logout/', views.coordinator_logout, name='coordinator_logout'),
]
