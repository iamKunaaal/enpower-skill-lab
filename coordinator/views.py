from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from schools.models import School
from django.utils import timezone
import json


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
    """Coordinator profile view with update functionality"""
    if not is_coordinator(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')

    if request.method == 'POST':
        try:
            # Get or create program coordinator profile
            coordinator = request.user.program_coordinator

            # Handle profile photo upload
            if request.FILES.get('profile_photo'):
                coordinator.profile_photo = request.FILES['profile_photo']

            # Update coordinator fields
            full_name = request.POST.get('full_name', '').strip()
            if full_name:
                coordinator.full_name = full_name
                # Also update user's first and last name
                name_parts = full_name.split(' ', 1)
                request.user.first_name = name_parts[0]
                request.user.last_name = name_parts[1] if len(name_parts) > 1 else ''

            # Update phone numbers
            mobile_number = request.POST.get('mobile_number', '').strip()
            if mobile_number:
                coordinator.mobile_number = mobile_number

            alternate_number = request.POST.get('alternate_number', '').strip()
            if alternate_number:
                coordinator.alternate_number = alternate_number
            else:
                coordinator.alternate_number = None

            # Update gender
            gender = request.POST.get('gender', '').strip()
            if gender:
                coordinator.gender = gender

            # Update date of birth
            date_of_birth = request.POST.get('date_of_birth', '').strip()
            if date_of_birth:
                coordinator.date_of_birth = date_of_birth

            # Update email
            email = request.POST.get('email', '').strip()
            if email:
                coordinator.official_email = email
                request.user.email = email

            # Save changes
            coordinator.save()
            request.user.save()

            messages.success(request, 'Your profile has been updated successfully!')
            return redirect('coordinator:coordinator_profile')

        except Exception as e:
            messages.error(request, f'Error updating profile: {str(e)}')
            return redirect('coordinator:coordinator_profile')

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

            # Update last password change timestamp
            try:
                coordinator = request.user.program_coordinator
                coordinator.last_password_change = timezone.now()
                coordinator.save()
            except:
                pass  # Coordinator profile might not exist

            messages.success(request, 'Your password was successfully updated!')
            return redirect('coordinator:coordinator_profile')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = PasswordChangeForm(request.user)

    return render(request, 'coordinator/change_password.html', {'form': form})


@login_required
def coordinator_logout(request):
    """Coordinator logout view"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('login')


@login_required
def school_list(request):
    """School list view"""
    if not is_coordinator(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')

    # Fetch all schools from the database
    schools = School.objects.all().order_by('-created_at')

    context = {
        'schools': schools,
    }

    return render(request, 'coordinator/school-list.html', context)
