from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from schools.models import School
import json

# Helper function to check role
def is_superadmin(user):
    return user.is_authenticated and user.role == "SUPER_ADMIN"


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
