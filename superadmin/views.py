from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth import get_user_model, logout
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from schools.models import School
from school_admin.models import SchoolAdmin
from .models import SuperAdmin
import json
import secrets
import string

# Helper function to check role
def is_superadmin(user):
    return user.is_authenticated and user.role == "SUPER_ADMIN"


# Test view for previewing toast messages (remove in production)
@login_required
@user_passes_test(is_superadmin)
def test_messages(request):
    """Test view to preview all toast notification types"""
    messages.success(request, 'This is a success message! Your operation completed successfully.')
    messages.error(request, 'This is an error message! Something went wrong.')
    messages.warning(request, 'This is a warning message! Please be careful.')
    messages.info(request, 'This is an info message! Here is some information for you.')
    return redirect('superadmin_dashboard')


@login_required
def superadmin_logout(request):
    """Logout view for super admin"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('login')  # Redirect to login page


@login_required
@user_passes_test(is_superadmin)
def dashboard(request):
    return render(request, 'superadmin/dashboard.html')


@login_required
@user_passes_test(is_superadmin)
def onboard_school(request):
    """
    View to handle school onboarding form.
    Supports both GET (display form) and POST (submit form data).
    """
    if request.method == 'POST':
        try:
            # Get form data
            data = request.POST
            
            # Create school instance
            school = School()
            
            # A. School Basic Information
            school.school_name = data.get('schoolName')
            school.school_code = data.get('schoolCode')
            school.board = data.get('board')
            school.school_type = data.get('schoolType')
            school.medium = data.get('medium')
            school.year_established = data.get('yearEstablished') or None
            school.school_email = data.get('schoolEmail')
            school.school_phone = data.get('schoolPhone')
            school.website = data.get('website') or None
            school.principal_name = data.get('principalName')
            school.principal_phone = data.get('principalPhone')
            school.principal_email = data.get('principalEmail')
            
            # B. School Branch Details
            school.branch_name = data.get('branchName') or None
            school.branch_code = data.get('branchCode') or None
            school.branch_address = data.get('branchAddress')
            school.city = data.get('city')
            school.state = data.get('state')
            school.pincode = data.get('pincode')
            school.num_students = data.get('numStudents') or None
            school.num_teachers = data.get('numTeachers') or None
            school.num_trainers = data.get('numTrainers') or None
            school.grades_available = data.get('gradesAvailable') or None
            school.shift_details = data.get('shiftDetails') or None
            school.branch_coordinator_name = data.get('branchCoordinatorName') or None
            school.branch_coordinator_phone = data.get('branchCoordinatorPhone') or None
            
            # C. Infrastructure & Facility Information
            school.csl_availability = data.get('cslAvailability') or None
            school.csl_rooms_count = data.get('cslRoomsCount') or None
            school.equipment_inventory = data.get('equipmentInventory') or None
            school.computer_lab_details = data.get('computerLabDetails') or None
            school.internet_details = data.get('internetDetails') or None
            school.classroom_count = data.get('classroomCount') or None
            school.sports_facilities = data.get('sportsFacilities') or None
            school.safety_measures = data.get('safetyMeasures') or None
            school.cctv_coverage = data.get('cctvCoverage') or None
            school.fire_safety_status = data.get('fireSafetyStatus') or None
            school.first_aid_availability = data.get('firstAidAvailability') or None
            
            # D. Academic Information
            school.total_students = data.get('totalStudents') or None
            school.class_wise_strength = data.get('classWiseStrength') or None
            school.student_teacher_ratio = data.get('studentTeacherRatio') or None
            school.curriculum_followed = data.get('curriculumFollowed') or None
            school.club_details = data.get('clubDetails') or None
            school.skill_subjects = data.get('skillSubjects') or None
            school.remedial_programs = data.get('remedialPrograms') or None
            
            # E. Skill Lab Integration
            school.skill_lab_reg_id = data.get('skillLabRegId') or None
            school.skills_offered = data.get('skillsOffered') or None
            school.batch_timings = data.get('batchTimings') or None
            school.trainers_assigned = data.get('trainersAssigned') or None
            school.lab_usage_hours = data.get('labUsageHours') or None
            school.student_groups_linked = data.get('studentGroupsLinked') or None
            school.csl_integration_status = data.get('cslIntegrationStatus') or None
            school.csl_project_list = data.get('cslProjectList') or None
            school.assessment_system_linked = data.get('assessmentSystemLinked') or None
            
            # F. Administrative Information
            school.billing_email = data.get('billingEmail')
            school.gst_number = data.get('gstNumber') or None
            school.payment_preferences = data.get('paymentPreferences') or None
            school.finance_contact = data.get('financeContact') or None
            school.admin_coordinator_name = data.get('adminCoordinatorName') or None
            school.admin_coordinator_phone = data.get('adminCoordinatorPhone') or None
            school.academic_year_cycle = data.get('academicYearCycle') or None
            school.workshop_approval_status = data.get('workshopApprovalStatus') or None
            school.digital_reports_consent = data.get('digitalReportsConsent') or None
            
            # G. Compliance & Documentation - Handle file uploads
            if 'schoolLogo' in request.FILES:
                school.school_logo = request.FILES['schoolLogo']
            if 'affiliationLetter' in request.FILES:
                school.affiliation_letter = request.FILES['affiliationLetter']
            if 'fireSafetyCert' in request.FILES:
                school.fire_safety_cert = request.FILES['fireSafetyCert']
            if 'registrationCert' in request.FILES:
                school.registration_cert = request.FILES['registrationCert']
            if 'trustRegistration' in request.FILES:
                school.trust_registration = request.FILES['trustRegistration']
            if 'childSafetyPolicy' in request.FILES:
                school.child_safety_policy = request.FILES['childSafetyPolicy']
            if 'insuranceDocs' in request.FILES:
                school.insurance_docs = request.FILES['insuranceDocs']
            
            school.lab_safety_compliance = data.get('labSafetyCompliance') or None
            school.teacher_police_verification = data.get('teacherPoliceVerification') or None
            
            # H. Emergency Information
            school.emergency_contact_person = data.get('emergencyContactPerson')
            school.emergency_phone = data.get('emergencyPhone')
            school.nearest_hospital = data.get('nearestHospital') or None
            school.evacuation_plan = data.get('evacuationPlan') or None
            
            # I. Additional Data (Optional)
            school.awards = data.get('awards') or None
            school.notable_alumni = data.get('notableAlumni') or None
            school.performance_trends = data.get('performanceTrends') or None
            school.social_media_links = data.get('socialMediaLinks') or None
            school.events_calendar = data.get('eventsCalendar') or None
            
            # Mark onboarding as completed
            school.onboarding_completed = True
            
            # Save the school
            school.save()
            
            messages.success(request, f'School "{school.school_name}" has been successfully onboarded!')
            return redirect('superadmin_dashboard')
            
        except Exception as e:
            messages.error(request, f'Error onboarding school: {str(e)}')
            return render(request, 'superadmin/onboard-school.html')
    
    # GET request - display the form
    return render(request, 'superadmin/onboard-school.html')


@login_required
@user_passes_test(is_superadmin)
def school_list(request):
    """
    View to display list of all schools.
    """
    schools = School.objects.all().order_by('-created_at')
    
    # Add helper properties for each school
    colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
    for school in schools:
        # Get initials from school name
        words = school.school_name.strip().split()
        if len(words) >= 2:
            school.initials = (words[0][0] + words[1][0]).upper()
        else:
            school.initials = school.school_name[:2].upper()
        
        # Assign badge color based on first character
        school.badge_color = colors[ord(school.school_name[0]) % len(colors)]
    
    context = {
        'schools': schools,
        'total_schools': schools.count(),
        'active_schools': schools.filter(is_active=True).count(),
    }
    return render(request, 'superadmin/school-list.html', context)


@login_required
@user_passes_test(is_superadmin)
def search_schools(request):
    """
    AJAX endpoint to search schools by name, code, or city.
    Returns JSON response with matching schools and their assignment status.
    """
    query = request.GET.get('q', '').strip()

    if not query:
        return JsonResponse({'schools': []})

    # Search schools by name, code, or city
    schools = School.objects.filter(
        Q(school_name__icontains=query) |
        Q(school_code__icontains=query) |
        Q(city__icontains=query)
    ).values('id', 'school_name', 'school_code', 'city', 'state')[:10]  # Limit to 10 results

    # Convert to list and add assignment status
    schools_list = list(schools)
    for school in schools_list:
        # Check if this school already has an admin assigned
        has_admin = SchoolAdmin.objects.filter(school_id=school['id'], is_active=True).exists()
        school['has_admin'] = has_admin

    return JsonResponse({'schools': schools_list})


@login_required
@user_passes_test(is_superadmin)
def school_admin_list(request):
    """
    View to display list of all school admins.
    """
    school_admins = SchoolAdmin.objects.select_related('school').all().order_by('-created_at')

    # Add helper properties for each admin
    colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
    for admin in school_admins:
        # Get initials from admin name
        words = admin.full_name.strip().split()
        if len(words) >= 2:
            admin.initials = (words[0][0] + words[1][0]).upper()
        else:
            admin.initials = admin.full_name[:2].upper()

        # Assign badge color based on first character
        admin.badge_color = colors[ord(admin.full_name[0]) % len(colors)]
        
        # Check if profile photo file actually exists
        admin.has_photo = bool(admin.profile_photo and admin.profile_photo.name)

    context = {
        'school_admins': school_admins,
        'total_admins': school_admins.count(),
        'active_admins': school_admins.filter(account_status='active').count(),
        'pending_admins': school_admins.filter(account_status='pending').count(),
    }
    return render(request, 'superadmin/school-admin-list.html', context)


@login_required
@user_passes_test(is_superadmin)
def onboard_school_admin(request):
    """
    View to handle school admin onboarding form.
    Supports both GET (display form) and POST (submit form data).
    """
    User = get_user_model()

    if request.method == 'POST':
        try:
            # Get form data
            data = request.POST

            # Check if school already has an admin
            school_id = data.get('school')
            existing_admin = SchoolAdmin.objects.filter(school_id=school_id, is_active=True).first()

            if existing_admin:
                school = School.objects.get(id=school_id)
                messages.error(
                    request,
                    f'This school "{school.school_name}" already has an assigned School Admin: {existing_admin.full_name} ({existing_admin.email}). Each school can only have one School Admin.'
                )
                schools = School.objects.all().order_by('school_name')
                return render(request, 'superadmin/onboard-school-admin.html', {'schools': schools})

            # Generate temporary password
            def generate_temp_password(length=12):
                """Generate a secure random password"""
                characters = string.ascii_letters + string.digits + "!@#$%"
                return ''.join(secrets.choice(characters) for _ in range(length))

            temp_password = generate_temp_password()

            # Create User account
            user = User.objects.create(
                username=data.get('email'),  # Use email as username
                email=data.get('email'),
                first_name=data.get('fullName').split()[0] if data.get('fullName') else '',
                last_name=' '.join(data.get('fullName').split()[1:]) if len(data.get('fullName', '').split()) > 1 else '',
                role='SCHOOL_ADMIN',
                is_active=True,
                password=make_password(temp_password)  # Hash the password
            )

            # Create SchoolAdmin profile
            school_admin = SchoolAdmin.objects.create(
                user=user,
                full_name=data.get('fullName'),
                email=data.get('email'),
                phone=data.get('phone'),
                gender=data.get('gender'),
                date_of_birth=data.get('dateOfBirth') if data.get('dateOfBirth') else None,
                address=data.get('address') if data.get('address') else None,
                city=data.get('city') if data.get('city') else None,
                state=data.get('state') if data.get('state') else None,
                pincode=data.get('pincode') if data.get('pincode') else None,
                school_id=data.get('school'),
                account_status='pending',
                is_active=True,
                temporary_password=make_password(temp_password),  # Store hashed temp password
                password_changed=False,
                created_by=request.user
            )

            # Print confirmation to terminal
            print("\n" + "="*80)
            print("✅ SCHOOL ADMIN CREATED SUCCESSFULLY")
            print("="*80)
            print(f"School Admin ID: {school_admin.id}")
            print(f"User ID: {user.id}")
            print(f"Full Name: {school_admin.full_name}")
            print(f"Email: {school_admin.email}")
            print(f"Username: {user.username}")
            print(f"Temporary Password: {temp_password}")
            print(f"School ID: {school_admin.school_id}")
            print(f"Account Status: {school_admin.account_status}")
            print("="*80 + "\n")

            # Handle profile photo upload
            if 'profilePhoto' in request.FILES:
                school_admin.profile_photo = request.FILES['profilePhoto']
                school_admin.save()

            # Send email with credentials
            try:
                school = School.objects.get(id=data.get('school'))
                email_subject = 'Welcome to Enpower Skill Lab - Your Admin Account'
                email_body = f"""
Dear {school_admin.full_name},

You have been registered as a School Administrator for {school.school_name}.

Your Login Credentials:
- Username: {user.email}
- Temporary Password: {temp_password}
- Login URL: {request.build_absolute_uri('/')[:-1]}/login/

IMPORTANT: Please change your password immediately after your first login for security reasons.

If you have any questions, please contact support.

Best regards,
Enpower Skill Lab Team
                """

                send_mail(
                    email_subject,
                    email_body,
                    settings.DEFAULT_FROM_EMAIL,
                    [school_admin.email],
                    fail_silently=False,
                )

                messages.success(request, f'School Admin "{school_admin.full_name}" has been successfully onboarded! Credentials sent to {school_admin.email}.')
            except Exception as email_error:
                messages.warning(request, f'School Admin created but email failed to send: {str(email_error)}. Temporary password: {temp_password}')

            return redirect('superadmin_dashboard')

        except Exception as e:
            messages.error(request, f'Error onboarding school admin: {str(e)}')
            return render(request, 'superadmin/onboard-school-admin.html', {'schools': School.objects.all()})

    # GET request - display the form with list of schools
    schools = School.objects.all().order_by('school_name')
    context = {
        'schools': schools,
    }
    return render(request, 'superadmin/onboard-school-admin.html', context)


@login_required
@user_passes_test(is_superadmin)
def profile(request):
    """
    View to display the super admin profile page.
    """
    # Get or create SuperAdmin profile for the current user
    try:
        profile = SuperAdmin.objects.get(user=request.user)
    except SuperAdmin.DoesNotExist:
        profile = None

    context = {
        'profile': profile,
        'user': request.user,
    }
    return render(request, 'superadmin/profile.html', context)


@login_required
@user_passes_test(is_superadmin)
def profile_update(request):
    """
    View to handle super admin profile updates.
    """
    if request.method == 'POST':
        try:
            # Get or create SuperAdmin profile for the current user
            profile, created = SuperAdmin.objects.get_or_create(
                user=request.user,
                defaults={
                    'email': request.user.email,
                    'full_name': request.user.get_full_name() or request.user.username,
                    'phone': '',
                }
            )

            # Update profile fields from form data
            profile.full_name = request.POST.get('full_name', profile.full_name)
            profile.email = request.POST.get('email', profile.email)
            profile.phone = request.POST.get('phone', profile.phone)
            profile.alternate_phone = request.POST.get('alternate_phone', '')
            profile.gender = request.POST.get('gender', '')

            # Handle date of birth
            date_of_birth = request.POST.get('date_of_birth', '')
            if date_of_birth:
                profile.date_of_birth = date_of_birth

            # Handle profile photo upload
            if 'profile_photo' in request.FILES:
                profile.profile_photo = request.FILES['profile_photo']

            # Update last login time
            profile.last_login = timezone.now()

            # Save the profile
            profile.save()

            # Also update the User model
            request.user.email = profile.email
            if profile.full_name:
                name_parts = profile.full_name.split(maxsplit=1)
                request.user.first_name = name_parts[0]
                request.user.last_name = name_parts[1] if len(name_parts) > 1 else ''
            request.user.save()

            messages.success(request, 'Your profile has been updated successfully!')
            return redirect('superadmin_profile')

        except Exception as e:
            messages.error(request, f'Error updating profile: {str(e)}')
            return redirect('superadmin_profile')

    # If not POST, redirect to profile page
    return redirect('superadmin_profile')


@login_required
@user_passes_test(is_superadmin)
def change_password(request):
    """
    View to handle password change for super admin.
    """
    if request.method == 'POST':
        current_password = request.POST.get('current_password', '')
        new_password = request.POST.get('new_password', '')
        confirm_password = request.POST.get('confirm_password', '')
        
        # Validate current password
        if not request.user.check_password(current_password):
            messages.error(request, 'Current password is incorrect.')
            return redirect('superadmin_change_password')
        
        # Validate new password
        if not new_password:
            messages.error(request, 'New password is required.')
            return redirect('superadmin_change_password')
        
        # Check password requirements
        if len(new_password) < 8:
            messages.error(request, 'Password must be at least 8 characters long.')
            return redirect('superadmin_change_password')
        
        # Validate confirm password
        if new_password != confirm_password:
            messages.error(request, 'New passwords do not match.')
            return redirect('superadmin_change_password')
        
        # Check if new password is same as current
        if current_password == new_password:
            messages.error(request, 'New password must be different from current password.')
            return redirect('superadmin_change_password')
        
        try:
            # Update password
            request.user.set_password(new_password)
            request.user.save()
            
            # Update last_password_change in SuperAdmin profile
            try:
                profile = SuperAdmin.objects.get(user=request.user)
                profile.last_password_change = timezone.now()
                profile.save()
            except SuperAdmin.DoesNotExist:
                pass
            
            # Send email notification
            try:
                send_mail(
                    subject='Password Changed - ENpower Skill Lab',
                    message=f'''Hello {request.user.get_full_name() or request.user.username},

Your password for ENpower Skill Lab Super Admin account has been changed successfully.

If you did not make this change, please contact the administrator immediately.

Date & Time: {timezone.now().strftime("%B %d, %Y at %I:%M %p")}

Best regards,
ENpower Skill Lab Team''',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[request.user.email],
                    fail_silently=True,
                )
            except Exception as email_error:
                # Log email error but don't fail the password change
                print(f"Email notification failed: {email_error}")
            
            messages.success(request, 'Your password has been changed successfully. A confirmation email has been sent to your registered email address.')
            
            # Re-authenticate user to prevent logout
            from django.contrib.auth import update_session_auth_hash
            update_session_auth_hash(request, request.user)
            
            return redirect('superadmin_change_password')
            
        except Exception as e:
            messages.error(request, f'Error changing password: {str(e)}')
            return redirect('superadmin_change_password')
    
    # GET request - render the change password page
    return render(request, 'superadmin/change-password.html')


# Student Onboarding Views
@login_required
@user_passes_test(is_superadmin)
def onboard_student(request):
    """View for onboarding new students"""
    if request.method == 'POST':
        try:
            from .models import Student
            import uuid
            from datetime import date
            import secrets
            import string
            # Generate unique skill lab registration ID
            year = date.today().year
            random_str = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
            skill_lab_reg_id = f"SKILL{year}{random_str}"

            # Create student instance
            student = Student()

            # A. Basic Information
            if 'student_photo' in request.FILES:
                student.student_photo = request.FILES['student_photo']
            student.first_name = request.POST.get('first_name', '')
            student.middle_name = request.POST.get('middle_name', '')
            student.last_name = request.POST.get('last_name', '')
            student.gender = request.POST.get('gender', '')
            student.date_of_birth = request.POST.get('date_of_birth', '')
            student.nationality = request.POST.get('nationality', 'Indian')
            student.mother_tongue = request.POST.get('mother_tongue', '')
            student.blood_group = request.POST.get('blood_group', '')
            student.aadhar_number = request.POST.get('aadhar_number', '')

            # B. Academic Details
            student.school_name = request.POST.get('school_name', '')
            student.school_branch = request.POST.get('school_branch', '')
            student.student_class = request.POST.get('student_class', '')
            student.division = request.POST.get('division', '')
            student.roll_number = request.POST.get('roll_number', '')
            student.academic_year = request.POST.get('academic_year', '')
            student.gr_number = request.POST.get('gr_number', '')
            student.previous_school = request.POST.get('previous_school', '')
            student.stream = request.POST.get('stream', '')
            student.school_board = request.POST.get('school_board', '')

            # C. Contact Details
            student.student_mobile = request.POST.get('student_mobile', '')
            student.school_email = request.POST.get('school_email', '')
            student.personal_email = request.POST.get('personal_email', '')
            student.address = request.POST.get('address', '')

            # D. Skill Lab Specific Details
            student.skill_lab_reg_id = skill_lab_reg_id
            student.enrollment_date = request.POST.get('enrollment_date', '')
            student.skills_enrolled = request.POST.get('skills_enrolled', '')
            student.current_skill_level = request.POST.get('current_skill_level', '')
            student.assigned_trainer = request.POST.get('assigned_trainer', '')
            student.batch_timing = request.POST.get('batch_timing', '')
            student.learning_style = request.POST.get('learning_style', '')
            student.interests_aptitude = request.POST.get('interests_aptitude', '')
            student.preferred_language = request.POST.get('preferred_language', '')
            student.attendance_status = request.POST.get('attendance_status', 'active')

            # E. Health & Safety
            student.medical_conditions = request.POST.get('medical_conditions', '')
            student.allergies = request.POST.get('allergies', '')
            student.emergency_instructions = request.POST.get('emergency_instructions', '')
            student.doctor_name = request.POST.get('doctor_name', '')
            student.doctor_contact = request.POST.get('doctor_contact', '')
            student.physical_limitations = request.POST.get('physical_limitations', '')

            # F. Emergency Contact
            student.emergency_name = request.POST.get('emergency_name', '')
            student.emergency_relationship = request.POST.get('emergency_relationship', '')
            student.emergency_mobile = request.POST.get('emergency_mobile', '')
            student.emergency_alt_mobile = request.POST.get('emergency_alt_mobile', '')
            student.emergency_address = request.POST.get('emergency_address', '')

            # G. Family Details
            student.sibling_1_name = request.POST.get('sibling_1_name', '')
            student.sibling_1_class_school = request.POST.get('sibling_1_class_school', '')
            student.sibling_1_skill_lab_id = request.POST.get('sibling_1_skill_lab_id', '')
            student.sibling_2_name = request.POST.get('sibling_2_name', '')
            student.sibling_2_class_school = request.POST.get('sibling_2_class_school', '')
            student.sibling_2_skill_lab_id = request.POST.get('sibling_2_skill_lab_id', '')
            student.sibling_3_name = request.POST.get('sibling_3_name', '')
            student.sibling_3_class_school = request.POST.get('sibling_3_class_school', '')
            student.sibling_3_skill_lab_id = request.POST.get('sibling_3_skill_lab_id', '')

            # Set metadata
            student.created_by = request.user

            # Save the student
            student.save()

            messages.success(request, f'Student {student.full_name} added successfully! Skill Lab ID: {skill_lab_reg_id}')
            return redirect('onboard_student')

        except Exception as e:
            messages.error(request, f'Error adding student: {str(e)}')
            return redirect('onboard_student')

    # GET request - render the onboarding form
    schools = School.objects.filter(is_active=True)
    context = {
        'schools': schools
    }
    return render(request, 'superadmin/onboard-student.html', context)


@login_required
@user_passes_test(is_superadmin)
def student_list(request):
    """View to display list of all students"""
    from .models import Student
    import random
    
    # Get all students
    students = Student.objects.all().order_by('-created_at')
    
    # Add badge colors for students without photos
    badge_colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#a855f7']
    for student in students:
        student.badge_color = random.choice(badge_colors)
    
    context = {
        'students': students
    }
    return render(request, 'superadmin/students-list.html', context)


@login_required
@user_passes_test(is_superadmin)
def view_student(request, student_id):
    """View to display student details"""
    from .models import Student
    student = get_object_or_404(Student, id=student_id)
    context = {
        'student': student
    }
    return render(request, 'superadmin/view-student.html', context)


@login_required
@user_passes_test(is_superadmin)
def edit_student(request, student_id):
    """View to edit student details"""
    from .models import Student
    student = get_object_or_404(Student, id=student_id)
    
    if request.method == 'POST':
        # Handle form submission for editing
        try:
            student.first_name = request.POST.get('first_name', student.first_name)
            student.middle_name = request.POST.get('middle_name', student.middle_name)
            student.last_name = request.POST.get('last_name', student.last_name)
            student.gender = request.POST.get('gender', student.gender)
            student.date_of_birth = request.POST.get('date_of_birth', student.date_of_birth)
            student.student_class = request.POST.get('student_class', student.student_class)
            student.division = request.POST.get('division', student.division)
            student.attendance_status = request.POST.get('attendance_status', student.attendance_status)
            student.save()
            
            messages.success(request, f'Student {student.full_name} updated successfully!')
            return redirect('student_list')
        except Exception as e:
            messages.error(request, f'Error updating student: {str(e)}')
    
    schools = School.objects.filter(is_active=True)
    context = {
        'student': student,
        'schools': schools
    }
    return render(request, 'superadmin/edit-student.html', context)


# Teacher Onboarding Views
@login_required
@user_passes_test(is_superadmin)
def onboard_teacher(request):
    """View for onboarding new teachers"""
    if request.method == 'POST':
        try:
            from .models import Teacher
            from datetime import date
            import secrets
            import string

            # Get employee ID from form or generate new one
            employee_id = request.POST.get('employee_id', '')
            if not employee_id or employee_id == 'Auto-generated':
                year = date.today().year
                random_str = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
                employee_id = f"EMP{year}{random_str}"

            # Create teacher instance
            teacher = Teacher()

            # A. Basic Information
            if 'profile_photo' in request.FILES:
                teacher.profile_photo = request.FILES['profile_photo']
            teacher.employee_id = employee_id
            teacher.full_name = request.POST.get('full_name', '')
            teacher.gender = request.POST.get('gender', '')
            teacher.date_of_birth = request.POST.get('date_of_birth', '')
            teacher.blood_group = request.POST.get('blood_group', '') or None
            teacher.nationality = request.POST.get('nationality', 'Indian')
            teacher.aadhar_number = request.POST.get('aadhar_number', '') or None
            teacher.pan_number = request.POST.get('pan_number', '') or None

            # B. Professional Details
            teacher.designation = request.POST.get('designation', '')
            teacher.qualification = request.POST.get('qualification', '')
            teacher.specialization = request.POST.get('specialization', '') or None
            teacher.total_experience = request.POST.get('total_experience', '')
            teacher.skill_training_experience = request.POST.get('skill_training_experience', '') or None
            teacher.previous_organizations = request.POST.get('previous_organizations', '') or None
            teacher.certifications = request.POST.get('certifications', '') or None
            teacher.languages_known = request.POST.get('languages_known', '') or None
            teacher.grades_taught = request.POST.get('grades_taught', '') or None
            teacher.training_style = request.POST.get('training_style', '') or None

            # C. Contact Information
            teacher.mobile_number = request.POST.get('mobile_number', '')
            teacher.alternate_number = request.POST.get('alternate_number', '') or None
            teacher.official_email = request.POST.get('official_email', '')
            teacher.personal_email = request.POST.get('personal_email', '') or None

            # D. Address Details
            teacher.current_address = request.POST.get('current_address', '')
            teacher.permanent_address = request.POST.get('permanent_address', '') or None
            teacher.city = request.POST.get('city', '')
            teacher.state = request.POST.get('state', '')
            teacher.pin_code = request.POST.get('pin_code', '')

            # E. Skill Lab Work Details
            teacher.skill_lab_center = request.POST.get('skill_lab_center', '') or None
            teacher.branch_location = request.POST.get('branch_location', '') or None
            teacher.batch_timings = request.POST.get('batch_timings', '') or None
            teacher.weekly_timetable = request.POST.get('weekly_timetable', '') or None
            teacher.student_groups = request.POST.get('student_groups', '') or None
            teacher.modules_assigned = request.POST.get('modules_assigned', '') or None
            teacher.active_classes = request.POST.get('active_classes', '') or None
            total_students = request.POST.get('total_students', '')
            teacher.total_students = int(total_students) if total_students else 0
            teacher.dashboard_role = request.POST.get('dashboard_role', '') or None
            teacher.joining_date = request.POST.get('joining_date', '')
            contract_end = request.POST.get('contract_end_date', '')
            teacher.contract_end_date = contract_end if contract_end else None
            teacher.employment_type = request.POST.get('employment_type', '')

            # F. Emergency Information
            teacher.emergency_contact_name = request.POST.get('emergency_contact_name', '')
            teacher.emergency_relation = request.POST.get('emergency_relation', '')
            teacher.emergency_mobile = request.POST.get('emergency_mobile', '')
            teacher.emergency_secondary = request.POST.get('emergency_secondary', '') or None
            teacher.health_notes = request.POST.get('health_notes', '') or None

            # G. Compliance & Documentation
            teacher.id_proof_submitted = request.POST.get('id_proof_submitted', '') or None
            teacher.address_proof_submitted = request.POST.get('address_proof_submitted', '') or None
            teacher.police_verification = request.POST.get('police_verification', '') or None
            teacher.contract_uploaded = request.POST.get('contract_uploaded', '') or None
            if 'passport_photo' in request.FILES:
                teacher.passport_photo = request.FILES['passport_photo']
            teacher.pan_aadhar_linked = request.POST.get('pan_aadhar_linked', '') or None
            if 'resume' in request.FILES:
                teacher.resume = request.FILES['resume']
            teacher.bank_details_submitted = request.POST.get('bank_details_submitted', '') or None
            teacher.ifsc_code = request.POST.get('ifsc_code', '') or None
            teacher.bank_account_number = request.POST.get('bank_account_number', '') or None
            teacher.bank_name = request.POST.get('bank_name', '') or None
            teacher.branch_name = request.POST.get('branch_name', '') or None
            if 'passbook_copy' in request.FILES:
                teacher.passbook_copy = request.FILES['passbook_copy']

            # H. Additional Optional Data
            teacher.hobbies = request.POST.get('hobbies', '') or None
            teacher.strength_areas = request.POST.get('strength_areas', '') or None
            teacher.improvement_areas = request.POST.get('improvement_areas', '') or None
            teacher.training_resources = request.POST.get('training_resources', '') or None
            teacher.achievements = request.POST.get('achievements', '') or None

            # Set metadata
            teacher.created_by = request.user

            # Save the teacher
            teacher.save()

            messages.success(request, f'Teacher {teacher.full_name} added successfully! Employee ID: {employee_id}')
            return redirect('teacher_list')

        except Exception as e:
            messages.error(request, f'Error adding teacher: {str(e)}')
            return redirect('onboard_teacher')

    # GET request - render the onboarding form
    return render(request, 'superadmin/onboard-teacher.html')


@login_required
@user_passes_test(is_superadmin)
def teacher_list(request):
    """View to display list of all teachers"""
    from .models import Teacher
    import random

    # Get all teachers
    teachers = Teacher.objects.all().order_by('-created_at')

    # Add badge colors for teachers without photos
    badge_colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#a855f7']
    for teacher in teachers:
        teacher.badge_color = random.choice(badge_colors)

    context = {
        'teachers': teachers
    }
    return render(request, 'superadmin/teachers-list.html', context)


@login_required
@user_passes_test(is_superadmin)
def view_teacher(request, teacher_id):
    """View to display teacher details"""
    from .models import Teacher
    teacher = get_object_or_404(Teacher, id=teacher_id)
    
    # Add badge color
    badge_colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
    teacher.badge_color = badge_colors[teacher.id % len(badge_colors)]
    
    context = {
        'teacher': teacher
    }
    return render(request, 'superadmin/view-teacher.html', context)


@login_required
@user_passes_test(is_superadmin)
def edit_teacher(request, teacher_id):
    """View to edit teacher details"""
    from .models import Teacher
    teacher = get_object_or_404(Teacher, id=teacher_id)

    if request.method == 'POST':
        try:
            # Update basic info
            teacher.full_name = request.POST.get('full_name', teacher.full_name)
            teacher.gender = request.POST.get('gender', teacher.gender)
            dob = request.POST.get('date_of_birth', '')
            if dob:
                teacher.date_of_birth = dob
            teacher.blood_group = request.POST.get('blood_group', teacher.blood_group) or None
            teacher.nationality = request.POST.get('nationality', teacher.nationality)

            # Update professional details
            teacher.designation = request.POST.get('designation', teacher.designation)
            teacher.qualification = request.POST.get('qualification', teacher.qualification)
            teacher.total_experience = request.POST.get('total_experience', teacher.total_experience)
            teacher.employment_type = request.POST.get('employment_type', teacher.employment_type)

            # Update contact info
            teacher.mobile_number = request.POST.get('mobile_number', teacher.mobile_number)
            teacher.official_email = request.POST.get('official_email', teacher.official_email)
            teacher.city = request.POST.get('city', teacher.city)
            teacher.state = request.POST.get('state', teacher.state)

            # Update status
            teacher.attendance_status = request.POST.get('attendance_status', teacher.attendance_status)
            is_active = request.POST.get('is_active', 'true')
            teacher.is_active = is_active == 'true'

            teacher.save()

            messages.success(request, f'Teacher {teacher.full_name} updated successfully!')
            return redirect('teacher_list')
        except Exception as e:
            messages.error(request, f'Error updating teacher: {str(e)}')

    context = {
        'teacher': teacher
    }
    return render(request, 'superadmin/edit-teacher.html', context)
