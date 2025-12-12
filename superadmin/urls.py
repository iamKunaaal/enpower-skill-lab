from django.urls import path
from . import views


urlpatterns = [
    path('dashboard/', views.dashboard, name='superadmin_dashboard'),
    path('onboard-school/', views.onboard_school, name='onboard_school'),
    path('schools/', views.school_list, name='school_list'),
]