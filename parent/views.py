from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.http import JsonResponse
from django.utils.timesince import timesince
from .models import Parent
from schools.models import Class
from teacher.models import Teacher
from competencies.models import ScoreEntry, StudentAssessmentFeedback, StudentProjectFeedback
import json


def is_parent(user):
    """Check if user is a parent"""
    return user.is_authenticated and hasattr(user, 'role') and user.role == 'PARENT'


@login_required
@user_passes_test(is_parent)
def parent_dashboard(request):
    """Parent dashboard view"""
    children_data = []

    try:
        parent = Parent.objects.get(user=request.user)
        children = parent.students.filter(is_active=True)

        for child in children:
            # Find thinking coach via Class model
            coach_name = '—'
            child_class = Class.objects.filter(
                school=child.school,
                grade=child.student_class,
                division=child.division,
                is_active=True,
            ).select_related('thinking_coach').first()

            if child_class and child_class.thinking_coach:
                try:
                    teacher = Teacher.objects.get(user=child_class.thinking_coach)
                    coach_name = teacher.full_name
                except Teacher.DoesNotExist:
                    coach_name = child_class.thinking_coach.get_full_name() or child_class.thinking_coach.username

            # Build initials for avatar
            names = child.first_name.split()
            initials = (child.first_name[0] + child.last_name[0]).upper() if child.last_name else child.first_name[:2].upper()

            # Build recent activities for this child
            activities = []

            # Score entries
            scores = ScoreEntry.objects.filter(student=child).select_related(
                'assessment_competency__competency',
                'assessment_competency__assessment',
            ).order_by('-updated_at')[:5]
            for s in scores:
                comp_name = s.assessment_competency.competency.name if s.assessment_competency.competency else 'Unknown'
                assess_name = s.assessment_competency.assessment.name if s.assessment_competency.assessment else ''
                activities.append({
                    'type': 'score',
                    'icon': 'assignment_turned_in',
                    'color': 'blue',
                    'title': f'Score Recorded — {comp_name}',
                    'description': f'{assess_name} · Score: {s.score}/10',
                    'time': timesince(s.updated_at) + ' ago',
                    'timestamp': s.updated_at.isoformat(),
                })

            # Assessment feedback
            feedbacks = StudentAssessmentFeedback.objects.filter(student=child).select_related(
                'assessment',
            ).order_by('-updated_at')[:3]
            for f in feedbacks:
                activities.append({
                    'type': 'feedback',
                    'icon': 'comment',
                    'color': 'purple',
                    'title': f'Assessment Feedback',
                    'description': f'{f.assessment.name} — {f.feedback[:80]}' if f.feedback else f.assessment.name,
                    'time': timesince(f.updated_at) + ' ago',
                    'timestamp': f.updated_at.isoformat(),
                })

            # Project feedback
            proj_feedbacks = StudentProjectFeedback.objects.filter(student=child).select_related(
                'project',
            ).order_by('-updated_at')[:3]
            for pf in proj_feedbacks:
                activities.append({
                    'type': 'project_feedback',
                    'icon': 'rate_review',
                    'color': 'orange',
                    'title': f'Project Feedback — {pf.project.title}',
                    'description': pf.feedback[:80] if pf.feedback else 'Feedback received',
                    'time': timesince(pf.updated_at) + ' ago',
                    'timestamp': pf.updated_at.isoformat(),
                })

            # Sort by timestamp desc, limit to 5
            activities.sort(key=lambda x: x['timestamp'], reverse=True)
            activities = activities[:5]

            children_data.append({
                'id': child.id,
                'name': child.full_name,
                'first_name': child.first_name,
                'grade': f'Grade {child.student_class}',
                'grade_section': f'Grade {child.student_class} - Section {child.division}',
                'school': child.school.school_name if child.school else '—',
                'coach': coach_name,
                'initials': initials,
                'gender': getattr(child, 'gender', 'male'),
                'activities': activities,
            })
    except Parent.DoesNotExist:
        pass

    context = {
        'children': children_data,
        'children_json': json.dumps(children_data),
        'has_children': len(children_data) > 0,
    }
    return render(request, 'parent/dashboard.html', context)


@login_required
@user_passes_test(is_parent)
def parent_profile(request):
    """View for displaying parent profile"""
    try:
        parent = Parent.objects.get(user=request.user)
    except Parent.DoesNotExist:
        messages.error(request, 'Parent profile not found.')
        return redirect('parent_dashboard')

    context = {
        'parent': parent,
    }
    return render(request, 'parent/profile.html', context)


@login_required
@user_passes_test(is_parent)
def parent_profile_update(request):
    """View for updating parent profile"""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})

    try:
        parent = Parent.objects.get(user=request.user)
    except Parent.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Parent profile not found'})

    try:
        # Update profile fields
        parent.full_name = request.POST.get('full_name', parent.full_name)
        parent.mobile_number = request.POST.get('mobile_number', parent.mobile_number)
        parent.alternate_mobile = request.POST.get('alternate_mobile', '') or None
        parent.relation_to_student = request.POST.get('relation_to_student', parent.relation_to_student)
        parent.occupation = request.POST.get('occupation', '') or None
        parent.organization = request.POST.get('organization', '') or None

        # Handle profile photo upload
        if 'profile_photo' in request.FILES:
            parent.profile_photo = request.FILES['profile_photo']

        parent.save()

        return JsonResponse({
            'success': True,
            'message': 'Profile updated successfully',
            'reload': True
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })


@login_required
@user_passes_test(is_parent)
def parent_change_password(request):
    """Parent change password view"""
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Your password was successfully updated!')
            return redirect('parent_change_password')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = PasswordChangeForm(request.user)

    return render(request, 'parent/change_password.html', {'form': form})
