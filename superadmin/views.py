from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test

# Helper function to check role
def is_superadmin(user):
    return user.is_authenticated and user.role == "SUPER_ADMIN"


@login_required
@user_passes_test(is_superadmin)
def dashboard(request):
    return render(request, 'superadmin/dashboard.html')

 
    

