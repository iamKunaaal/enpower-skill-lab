from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Teacher
from student.models import Student
from lms.models import Lesson
import random


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


@login_required
def student_list(request):
    """Teacher Student List View - Shows students from assigned school"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    # Get teacher's assigned school
    teacher_school = None
    if hasattr(request.user, 'teacher_profile') and request.user.teacher_profile:
        teacher_school = request.user.teacher_profile.school
    
    # Get students from teacher's assigned school
    if teacher_school:
        students = Student.objects.filter(school=teacher_school, is_active=True).order_by('first_name', 'last_name')
    else:
        students = Student.objects.none()
    
    # Add computed properties for template
    badge_colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#a855f7']
    students_with_extras = []
    for student in students:
        student.initials = (student.first_name[0] + student.last_name[0]).upper() if student.first_name and student.last_name else 'ST'
        student.student_id = student.gr_number or student.skill_lab_reg_id or f'STU{student.id}'
        student.class_name = f"Class {student.student_class}-{student.division}" if student.division else f"Class {student.student_class}"
        student.badge_color = random.choice(badge_colors)
        students_with_extras.append(student)
    
    context = {
        'page_title': 'Student List',
        'students': students_with_extras,
    }
    return render(request, 'teacher/student-list.html', context)


@login_required
def view_student(request, student_id):
    """View individual student details"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    # Get teacher's assigned school
    teacher_school = None
    if hasattr(request.user, 'teacher_profile') and request.user.teacher_profile:
        teacher_school = request.user.teacher_profile.school
    
    # Get student - ensure they belong to teacher's school
    if teacher_school:
        student = get_object_or_404(Student, id=student_id, school=teacher_school)
    else:
        messages.error(request, 'No school assigned to your profile.')
        return redirect('teacher:student_list')
    
    # Add computed properties
    student.initials = (student.first_name[0] + student.last_name[0]).upper() if student.first_name and student.last_name else 'ST'
    student.student_id_display = student.gr_number or student.skill_lab_reg_id or f'STU{student.id}'
    student.class_name = f"Class {student.student_class}-{student.division}" if student.division else f"Class {student.student_class}"
    
    context = {
        'page_title': f'Student - {student.full_name}',
        'student': student,
    }
    return render(request, 'teacher/view-student.html', context)


@login_required
def lesson_library(request):
    """Teacher Lesson Library View"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    # Get teacher's assigned school
    teacher_school = None
    if hasattr(request.user, 'teacher_profile') and request.user.teacher_profile:
        teacher_school = request.user.teacher_profile.school
    
    # Get lessons - filter by teacher's school if applicable
    if teacher_school:
        lessons = Lesson.objects.filter(applicable_schools=teacher_school).order_by('-created_at')
    else:
        lessons = Lesson.objects.all().order_by('-created_at')
    
    context = {
        'page_title': 'Lesson Library',
        'lessons': lessons,
    }
    return render(request, 'teacher/lesson-library.html', context)


@login_required
def add_lesson(request):
    """Teacher Add Lesson View"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    if request.method == 'POST':
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        competency = request.POST.get('competency', '').strip()
        level = request.POST.get('level', 'beginner')
        module = request.POST.get('module', '').strip()
        applicable_grades = request.POST.get('applicable_grades', '').strip()
        status = request.POST.get('status', 'draft')
        primary_content_type = request.POST.get('primary_content_type', 'video')
        article_content = request.POST.get('article_content', '')
        video_urls = request.POST.get('video_urls', '')
        quiz_data = request.POST.get('quiz_data', '')
        
        if not title:
            messages.error(request, 'Lesson title is required.')
            return redirect('teacher:add_lesson')
        
        try:
            lesson = Lesson.objects.create(
                title=title,
                description=description,
                competency=competency,
                level=level,
                module=module,
                applicable_grades=applicable_grades,
                status=status,
                primary_content_type=primary_content_type,
                article_content=article_content,
                video_urls=video_urls,
                quiz_data=quiz_data,
            )
            
            # Handle thumbnail upload
            if 'thumbnail' in request.FILES:
                lesson.thumbnail = request.FILES['thumbnail']
                lesson.save()

            # Add teacher's school to applicable schools
            if hasattr(request.user, 'teacher_profile') and request.user.teacher_profile and request.user.teacher_profile.school:
                lesson.applicable_schools.add(request.user.teacher_profile.school)

            # Handle resource files
            import os
            from lms.models import LessonResource
            resource_files = request.FILES.getlist('resources')
            for resource_file in resource_files:
                # Get file extension
                file_extension = os.path.splitext(resource_file.name)[1].lower().replace('.', '')

                # Determine resource type
                resource_type_map = {
                    'pdf': 'pdf',
                    'doc': 'doc', 'docx': 'doc',
                    'ppt': 'ppt', 'pptx': 'ppt',
                    'xls': 'xls', 'xlsx': 'xls',
                }
                resource_type = resource_type_map.get(file_extension, 'other')

                # Create LessonResource
                LessonResource.objects.create(
                    lesson=lesson,
                    title=resource_file.name,
                    file=resource_file,
                    resource_type=resource_type,
                    file_size=resource_file.size
                )

            messages.success(request, f'Lesson "{title}" created successfully!')
            return redirect('teacher:lesson_library')
            
        except Exception as e:
            messages.error(request, f'Error creating lesson: {str(e)}')
            return redirect('teacher:add_lesson')
    
    context = {
        'page_title': 'Create Lesson',
    }
    return render(request, 'teacher/add-lesson.html', context)


@login_required
def view_lesson(request, lesson_id):
    """View individual lesson details"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')

    from lms.models import LessonResource
    import json

    lesson = get_object_or_404(Lesson, id=lesson_id)
    resources = LessonResource.objects.filter(lesson=lesson)

    # Parse video URLs from JSON
    video_urls_list = []
    if lesson.video_urls:
        try:
            video_urls_list = json.loads(lesson.video_urls)
        except (json.JSONDecodeError, TypeError):
            pass

    context = {
        'page_title': f'Lesson - {lesson.title}',
        'lesson': lesson,
        'resources': resources,
        'video_urls_list': video_urls_list,
    }
    return render(request, 'teacher/view-lesson.html', context)


@login_required
def edit_lesson(request, lesson_id):
    """Edit lesson"""
    if not is_teacher(request.user):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    lesson = get_object_or_404(Lesson, id=lesson_id)
    
    if request.method == 'POST':
        lesson.title = request.POST.get('title', lesson.title).strip()
        lesson.description = request.POST.get('description', lesson.description).strip()
        lesson.competency = request.POST.get('competency', lesson.competency).strip()
        lesson.level = request.POST.get('level', lesson.level)
        lesson.module = request.POST.get('module', lesson.module).strip()
        lesson.applicable_grades = request.POST.get('applicable_grades', lesson.applicable_grades).strip()
        lesson.primary_content_type = request.POST.get('primary_content_type', lesson.primary_content_type)
        lesson.status = request.POST.get('status', lesson.status)
        lesson.article_content = request.POST.get('article_content', lesson.article_content or '')
        lesson.video_urls = request.POST.get('video_urls', lesson.video_urls or '')
        lesson.quiz_data = request.POST.get('quiz_data', lesson.quiz_data or '')
        
        if 'thumbnail' in request.FILES:
            lesson.thumbnail = request.FILES['thumbnail']

        lesson.save()

        # Handle new resource files
        import os
        from lms.models import LessonResource
        resource_files = request.FILES.getlist('resources')
        for resource_file in resource_files:
            # Get file extension
            file_extension = os.path.splitext(resource_file.name)[1].lower().replace('.', '')

            # Determine resource type
            resource_type_map = {
                'pdf': 'pdf',
                'doc': 'doc', 'docx': 'doc',
                'ppt': 'ppt', 'pptx': 'ppt',
                'xls': 'xls', 'xlsx': 'xls',
            }
            resource_type = resource_type_map.get(file_extension, 'other')

            # Create LessonResource
            LessonResource.objects.create(
                lesson=lesson,
                title=resource_file.name,
                file=resource_file,
                resource_type=resource_type,
                file_size=resource_file.size
            )

        messages.success(request, f'Lesson "{lesson.title}" updated successfully!')
        return redirect('teacher:lesson_library')

    # GET request - load existing resources
    from lms.models import LessonResource
    resources = LessonResource.objects.filter(lesson=lesson)

    context = {
        'page_title': f'Edit Lesson - {lesson.title}',
        'lesson': lesson,
        'resources': resources,
    }
    return render(request, 'teacher/edit-lesson.html', context)


@login_required
def delete_lessons(request):
    """Delete multiple lessons"""
    import json
    from django.http import JsonResponse
    
    if not is_teacher(request.user):
        return JsonResponse({'success': False, 'error': 'Permission denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
    
    try:
        data = json.loads(request.body)
        lesson_ids = data.get('lesson_ids', [])
        
        if not lesson_ids:
            return JsonResponse({'success': False, 'error': 'No lessons selected'})
        
        # Delete the lessons
        deleted_count = Lesson.objects.filter(id__in=lesson_ids).delete()[0]
        
        return JsonResponse({
            'success': True,
            'message': f'{deleted_count} lesson(s) deleted successfully'
        })
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
