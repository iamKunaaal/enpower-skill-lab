from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.contrib.auth import logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.db.models import Count
from schools.models import School, Class
from teacher.models import Teacher
from student.models import Student
from django.utils import timezone
from operator import attrgetter
import json


def is_coordinator(user):
    """Check if user is a program coordinator"""
    return user.is_authenticated and hasattr(user, 'role') and user.role == 'PROGRAM_COORDINATOR'


@login_required
@user_passes_test(is_coordinator)
def coordinator_dashboard(request):
    """Coordinator dashboard view"""
    # Get coordinator profile and assigned schools
    try:
        coordinator = request.user.program_coordinator
        assigned_schools = coordinator.schools_assigned.all()
    except Exception:
        assigned_schools = School.objects.none()

    assigned_school_ids = assigned_schools.values_list('id', flat=True)

    # Dynamic counts
    total_schools = assigned_schools.count()
    total_teachers = Teacher.objects.filter(school_id__in=assigned_school_ids).count()
    total_students = Student.objects.filter(school_id__in=assigned_school_ids).count()

    # Schools with teacher/student/class counts for the table
    schools_with_counts = assigned_schools.annotate(
        teacher_count=Count('teachers', distinct=True),
        student_count=Count('students', distinct=True),
        class_count=Count('classes', distinct=True),
    ).order_by('-created_at')[:5]

    # Add initials for avatar display
    for school in schools_with_counts:
        words = school.school_name.split()
        school.initials = ''.join([w[0].upper() for w in words[:2]]) if words else '??'

    # School-wise summary (same data, add total_count for display)
    school_summary = list(schools_with_counts)
    max_students = 1
    for school in school_summary:
        school.total_count = school.teacher_count + school.student_count + school.class_count
        if school.student_count > max_students:
            max_students = school.student_count

    # Recent Activities — merge recent teachers, students, classes from assigned schools
    recent_teachers = Teacher.objects.filter(school_id__in=assigned_school_ids).order_by('-created_at')[:5]
    recent_students = Student.objects.filter(school_id__in=assigned_school_ids).order_by('-created_at')[:5]
    recent_classes = Class.objects.filter(school_id__in=assigned_school_ids).order_by('-created_at')[:5]

    activities = []
    for t in recent_teachers:
        t.activity_type = 'teacher'
        t.title = f'New Teacher Added'
        t.description = f'{t.full_name} joined as {t.get_designation_display() if hasattr(t, "get_designation_display") else t.designation}'
        t.school_name = t.school.school_name if t.school else '—'
        activities.append(t)

    for s in recent_students:
        s.activity_type = 'student'
        s.title = f'New Student Enrolled'
        s.description = f'{s.first_name} {s.last_name} enrolled in Class {s.student_class or "—"}'
        s.school_name = s.school.school_name if s.school else '—'
        activities.append(s)

    for c in recent_classes:
        c.activity_type = 'class'
        c.title = f'New Class Created'
        c.description = f'{c.class_name} — {c.academic_year}'
        c.school_name = c.school.school_name if c.school else '—'
        activities.append(c)

    activities.sort(key=attrgetter('created_at'), reverse=True)
    recent_activities = activities[:5]

    context = {
        'total_schools': total_schools,
        'total_teachers': total_teachers,
        'total_students': total_students,
        'pending_alerts': 0,
        'assigned_schools': schools_with_counts,
        'school_summary': school_summary,
        'max_students': max_students,
        'recent_activities': recent_activities,
    }
    return render(request, 'coordinator/dashboard.html', context)


@login_required
@user_passes_test(is_coordinator)
def coordinator_profile(request):
    """Coordinator profile view with update functionality"""
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
@user_passes_test(is_coordinator)
def coordinator_change_password(request):
    """Coordinator change password view"""
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
@user_passes_test(is_coordinator)
def school_list(request):
    """School list view"""
    # Fetch all schools from the database
    schools = School.objects.all().order_by('-created_at')

    context = {
        'schools': schools,
    }

    return render(request, 'coordinator/school-list.html', context)
