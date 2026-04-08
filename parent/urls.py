from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.parent_dashboard, name='parent_dashboard'),
    path('profile/', views.parent_profile, name='parent_profile'),
    path('profile/update/', views.parent_profile_update, name='parent_profile_update'),
    path('change-password/', views.parent_change_password, name='parent_change_password'),
]
