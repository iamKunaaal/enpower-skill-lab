from django.urls import path
from . import views


urlpatterns = [
    path('dashboard/', views.dashboard, name='superadmin_dashboard'),
    path('onboard-school/', views.onboard_school, name='onboard_school'),
    path('schools/', views.school_list, name='school_list'),
    path('school-admins/', views.school_admin_list, name='school_admin_list'),
    path('onboard-school-admin/', views.onboard_school_admin, name='onboard_school_admin'),
    path('api/search-schools/', views.search_schools, name='search_schools'),
]