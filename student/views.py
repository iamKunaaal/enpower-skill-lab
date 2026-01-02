from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json


def is_student(user):
    """Check if user is a student"""
    return user.is_authenticated and hasattr(user, 'role') and user.role == 'STUDENT'


@login_required
def student_dashboard(request):
    """Student dashboard view"""
    if not is_student(request.user):
        messages.error(request, 'You do not have permission to access the student dashboard.')
        return redirect('login')

    context = {
        'user': request.user,
    }
    return render(request, 'student/dashboard.html', context)


@login_required
def student_profile(request):
    """Student profile view"""
    if not is_student(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')

    context = {
        'user': request.user,
    }
    return render(request, 'student/profile.html', context)


@login_required
@require_POST
def update_profile(request):
    """Update student profile data via AJAX"""
    if not is_student(request.user):
        return JsonResponse({'success': False, 'message': 'Permission denied'}, status=403)

    try:
        data = json.loads(request.body)
        
        # Get student profile - handle both possible related names
        student = None
        if hasattr(request.user, 'student_profile'):
            student = request.user.student_profile
        elif hasattr(request.user, 'student'):
            student = request.user.student

        # Field mapping from JS field names to model field names
        field_mapping = {
            'fullName': None,  # Handle separately - split into first/last name
            'name': None,  # Handle separately
            'email': None,  # Handle separately - update user email
            'phone': 'student_mobile',
            'dob': 'date_of_birth',
            'gender': 'gender',
            'bloodGroup': 'blood_group',
            'address': 'address',
            'fatherName': None,  # Parent info not in student model
            'fatherOccupation': None,
            'fatherPhone': None,
            'motherName': None,
            'motherOccupation': None,
            'motherPhone': None,
            'nationality': 'nationality',
            'religion': None,  # Not in model
            'category': None,  # Not in model
            'previousSchool': 'previous_school',
            'emergencyName': 'emergency_name',
            'emergencyRelation': 'emergency_relationship',
            'emergencyPhone': 'emergency_mobile',
        }

        for key, value in data.items():
            if key == 'email':
                request.user.email = value
                request.user.save()
            elif key in ['fullName', 'name'] and value:
                # Split name into first and last name
                parts = value.strip().split(' ', 1)
                request.user.first_name = parts[0]
                request.user.last_name = parts[1] if len(parts) > 1 else ''
                request.user.save()
                if student:
                    student.first_name = parts[0]
                    student.last_name = parts[1] if len(parts) > 1 else ''
            elif key in field_mapping and field_mapping[key] and student:
                if hasattr(student, field_mapping[key]):
                    setattr(student, field_mapping[key], value)

        if student:
            student.save()
            
        return JsonResponse({'success': True, 'message': 'Profile updated successfully'})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


@login_required
@require_POST
def update_avatar(request):
    """Update student avatar via AJAX"""
    if not is_student(request.user):
        return JsonResponse({'success': False, 'message': 'Permission denied'}, status=403)

    try:
        if 'avatar' not in request.FILES:
            return JsonResponse({'success': False, 'message': 'No file provided'}, status=400)

        avatar_file = request.FILES['avatar']
        
        # Get student profile - handle both possible related names
        student = None
        if hasattr(request.user, 'student_profile'):
            student = request.user.student_profile
        elif hasattr(request.user, 'student'):
            student = request.user.student
            
        if not student:
            return JsonResponse({'success': False, 'message': 'Student profile not found'}, status=400)
        
        # Use the correct field name from the model
        student.student_photo = avatar_file
        student.save()

        return JsonResponse({
            'success': True,
            'message': 'Avatar updated successfully',
            'avatar_url': student.student_photo.url
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': str(e)}, status=400)
