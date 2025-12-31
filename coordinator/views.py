from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm


def is_coordinator(user):
    """Check if user is a program coordinator"""
    return user.is_authenticated and hasattr(user, 'role') and user.role == 'PROGRAM_COORDINATOR'


@login_required
def coordinator_dashboard(request):
    """Coordinator dashboard view"""
    if not is_coordinator(request.user):
        messages.error(request, 'You do not have permission to access the coordinator dashboard.')
        return redirect('login')
    
    context = {
        'total_schools': 12,
        'total_teachers': 89,
        'total_students': 2456,
        'pending_alerts': 7,
    }
    return render(request, 'coordinator/dashboard.html', context)


@login_required
def coordinator_profile(request):
    """Coordinator profile view"""
    if not is_coordinator(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    return render(request, 'coordinator/profile.html')


@login_required
def coordinator_change_password(request):
    """Coordinator change password view"""
    if not is_coordinator(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Your password was successfully updated!')
            return redirect('coordinator:coordinator_profile')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = PasswordChangeForm(request.user)
    
    return render(request, 'coordinator/change_password.html', {'form': form})


@login_required
def coordinator_logout(request):
    """Coordinator logout view"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('login')
