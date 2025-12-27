from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages
from teacher.models import Teacher


def is_teacher(user):
    """Check if user is a teacher/thinking coach"""
    return user.is_authenticated and hasattr(user, 'role') and user.role == 'THINKING_COACH'


@login_required
def teacher_dashboard(request):
    """Teacher dashboard view"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access the teacher dashboard.')
        return redirect('login')
    
    teacher_profile = None
    if hasattr(request.user, 'teacher_profile'):
        teacher_profile = request.user.teacher_profile
    
    context = {
        'teacher_profile': teacher_profile,
        'total_students': 156,
        'total_classes': 8,
        'assessments_completed': 42,
        'pending_reviews': 15,
    }
    
    return render(request, 'teacher/dashboard.html', context)


def teacher_logout(request):
    """Logout view for teacher"""
    logout(request)
    messages.success(request, 'You have been successfully logged out.')
    return redirect('login')


@login_required
def teacher_profile(request):
    """Teacher Profile View"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
        
    # Get profile for the user
    try:
        profile = Teacher.objects.get(user=request.user)
    except Teacher.DoesNotExist:
        profile = None
    
    context = {
        'page_title': 'My Profile',
        'profile': profile,
    }
    return render(request, 'teacher/profile.html', context)


@login_required
def teacher_profile_update(request):
    """Teacher Profile Update View"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    if request.method == 'POST':
                
        try:
            profile = Teacher.objects.get(user=request.user)
            
            # Update profile fields
            profile.full_name = request.POST.get('full_name', profile.full_name)
            profile.mobile_number = request.POST.get('mobile_number', profile.mobile_number)
            profile.alternate_number = request.POST.get('alternate_number', profile.alternate_number)
            profile.gender = request.POST.get('gender', profile.gender)
            
            date_of_birth = request.POST.get('date_of_birth')
            if date_of_birth:
                profile.date_of_birth = date_of_birth
            
            # Handle profile photo upload
            if 'profile_photo' in request.FILES:
                profile.profile_photo = request.FILES['profile_photo']
            
            profile.save()
            messages.success(request, 'Profile updated successfully!')
        except Teacher.DoesNotExist:
            messages.error(request, 'Profile not found.')
        
    return redirect('teacher:teacher_profile')


@login_required
def teacher_change_password(request):
    """Teacher Change Password View"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    if request.method == 'POST':
        current_password = request.POST.get('current_password', '')
        new_password = request.POST.get('new_password', '')
        confirm_password = request.POST.get('confirm_password', '')
        
        # Validate current password
        if not request.user.check_password(current_password):
            messages.error(request, 'Current password is incorrect.')
            return redirect('teacher:teacher_change_password')
        
        # Validate new password
        if not new_password:
            messages.error(request, 'New password is required.')
            return redirect('teacher:teacher_change_password')
        
        # Check password requirements
        if len(new_password) < 8:
            messages.error(request, 'Password must be at least 8 characters long.')
            return redirect('teacher:teacher_change_password')
        
        # Validate confirm password
        if new_password != confirm_password:
            messages.error(request, 'New passwords do not match.')
            return redirect('teacher:teacher_change_password')
        
        # Check if new password is same as current
        if current_password == new_password:
            messages.error(request, 'New password must be different from current password.')
            return redirect('teacher:teacher_change_password')
        
        try:
            # Update password
            request.user.set_password(new_password)
            request.user.save()
            
            # Update last_password_change in Teacher profile
            from django.utils import timezone
            try:
                teacher_profile = Teacher.objects.get(user=request.user)
                teacher_profile.last_password_change = timezone.now()
                teacher_profile.save()
            except Teacher.DoesNotExist:
                pass
            
            messages.success(request, 'Your password has been changed successfully!')
            
            # Keep user logged in after password change
            from django.contrib.auth import update_session_auth_hash
            update_session_auth_hash(request, request.user)
            
            return redirect('teacher:teacher_change_password')
            
        except Exception as e:
            messages.error(request, f'Error changing password: {str(e)}')
            return redirect('teacher:teacher_change_password')
    
    # GET request - render the change password page
    context = {
        'page_title': 'Change Password',
    }
    return render(request, 'teacher/change_password.html', context)
