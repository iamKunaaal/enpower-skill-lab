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
def student_reports(request):
    """Student skill passport reports page"""
    if not is_student(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')

    from competencies.models import ProjectReport

    student = None
    if hasattr(request.user, 'student_profile'):
        student = request.user.student_profile
    elif hasattr(request.user, 'student'):
        student = request.user.student

    reports = []
    if student:
        reports = ProjectReport.objects.filter(student=student).select_related('project').order_by('-project__sequence_number', '-generated_at')

    return render(request, 'student/reports.html', {'reports': reports})


@login_required
def student_reports(request):
    if not is_student(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')

    from competencies.models import ProjectReport
    student = getattr(request.user, 'student_profile', None) or getattr(request.user, 'student', None)
    reports = []
    if student:
        reports = ProjectReport.objects.filter(student=student).select_related('project').order_by('-project__sequence_number', '-generated_at')

    return render(request, 'student/reports.html', {'reports': reports})


@login_required
def student_report_detail(request, project_id):
    if not is_student(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')

    from competencies.models import ProjectReport
    from django.shortcuts import get_object_or_404

    student = getattr(request.user, 'student_profile', None) or getattr(request.user, 'student', None)
    if not student:
        messages.error(request, 'Student profile not found.')
        return redirect('student:student_reports')

    report = get_object_or_404(ProjectReport, student=student, project_id=project_id)

    # Categorize competencies by score label
    all_scores = report.all_competency_scores or []

    def get_label(score):
        if score >= 8:   return 'very_strong'
        if score >= 6:   return 'strong'
        if score >= 4:   return 'emerging'
        return 'skill_to_work_on'

    very_strong = [c for c in all_scores if get_label(c['score']) == 'very_strong']
    strong      = [c for c in all_scores if get_label(c['score']) == 'strong']
    emerging    = [c for c in all_scores if get_label(c['score']) == 'emerging']

    # Get teacher feedback
    from competencies.models import StudentAssessmentFeedback
    feedbacks = StudentAssessmentFeedback.objects.filter(
        student=student,
        assessment__project_id=project_id
    ).select_related('entered_by').order_by('-updated_at')

    return render(request, 'student/report-detail.html', {
        'report':      report,
        'very_strong': very_strong,
        'strong':      strong,
        'emerging':    emerging,
        'feedbacks':   feedbacks,
    })


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
