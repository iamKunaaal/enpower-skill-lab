"""
Bulk CSV Import for all user roles.
Handles: sample CSV download, CSV parsing, user creation with error tracking.
"""
import csv
import io
import json
import secrets
import string
from datetime import datetime

from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction

from schools.models import School

User = get_user_model()


def is_superadmin(user):
    return user.is_authenticated and user.role == "SUPER_ADMIN"


def generate_password(length=12):
    chars = string.ascii_letters + string.digits + '!@#$%'
    return ''.join(secrets.choice(chars) for _ in range(length))


def _opt(val):
    """Return None for empty strings, otherwise stripped value."""
    if val and val.strip():
        return val.strip()
    return None


def _opt_int(val, default=0):
    """Parse optional integer field."""
    if val and val.strip():
        try:
            return int(val.strip())
        except ValueError:
            return default
    return default


def _opt_bool(val, default=True):
    """Parse optional boolean field (yes/true/1 = True)."""
    if val and val.strip():
        return val.strip().lower() in ('yes', 'true', '1')
    return default


# ============================================================
# SAMPLE CSV DEFINITIONS — ALL columns per role
# ============================================================

SAMPLE_DATA = {
    'school_admin': {
        'headers': [
            'full_name', 'email', 'phone', 'gender', 'school_name',
            'date_of_birth', 'address', 'city', 'state', 'pincode',
        ],
        'rows': [
            ['Rahul Sharma', 'rahul@example.com', '9876543210', 'Male', 'Delhi Public School',
             '1990-05-15', '123 Main St', 'Mumbai', 'Maharashtra', '400001'],
            ['Priya Patel', 'priya@example.com', '9876543211', 'Female', 'Delhi Public School',
             '1992-08-20', '456 Park Ave', 'Delhi', 'Delhi', '110001'],
        ],
    },

    'teacher': {
        'headers': [
            # A. Basic Information
            'full_name', 'gender', 'date_of_birth', 'blood_group', 'nationality',
            'aadhar_number', 'pan_number',
            # B. Professional Details
            'designation', 'qualification', 'specialization', 'total_experience',
            'skill_training_experience', 'previous_organizations', 'certifications',
            'languages_known', 'grades_taught', 'training_style',
            # C. Contact Information
            'mobile_number', 'alternate_number', 'official_email', 'personal_email',
            # D. Address Details
            'current_address', 'permanent_address', 'city', 'state', 'pin_code',
            # E. Skill Lab Work Details
            'skill_lab_center', 'branch_location', 'batch_timings', 'weekly_timetable',
            'student_groups', 'modules_assigned', 'active_classes', 'total_students',
            'dashboard_role', 'joining_date', 'contract_end_date', 'employment_type',
            # F. Emergency Information
            'emergency_contact_name', 'emergency_relation', 'emergency_mobile',
            'emergency_secondary', 'health_notes',
            # G. Compliance & Documentation
            'id_proof_submitted', 'address_proof_submitted', 'police_verification',
            'contract_uploaded', 'pan_aadhar_linked', 'bank_details_submitted',
            # H. Bank Details
            'bank_name', 'branch_name', 'bank_account_number', 'ifsc_code',
            # I. Additional Optional Data
            'hobbies', 'strength_areas', 'improvement_areas', 'training_resources',
            'achievements',
            # School
            'school_name',
        ],
        'rows': [
            [
                # A. Basic
                'Ankit Verma', 'Male', '1988-03-10', 'B+', 'Indian',
                '123456789012', 'ABCDE1234F',
                # B. Professional
                'enpower-trainer', 'B.Ed', 'Science Education', '5 years',
                '3 years', '', '',
                'English, Hindi', '6,7,8', 'interactive',
                # C. Contact
                '9876543212', '', 'ankit@example.com', '',
                # D. Address
                '789 Oak Rd', '', 'Pune', 'Maharashtra', '411001',
                # E. Skill Lab
                '', '', '', '',
                '', '', '', '',
                '', '2024-04-01', '', 'full-time',
                # F. Emergency
                'Suresh Verma', 'parent', '9876543200',
                '', '',
                # G. Compliance
                '', '', '', '', '', '',
                # H. Bank
                'SBI', 'Kothrud', '12345678901234', 'SBIN0001234',
                # I. Additional
                '', '', '', '', '',
                # School
                'Delhi Public School',
            ],
        ],
    },

    'student': {
        'headers': [
            # A. Basic Information
            'first_name', 'middle_name', 'last_name', 'gender', 'date_of_birth',
            'nationality', 'mother_tongue', 'blood_group', 'aadhar_number',
            # B. Academic Details
            'school_name', 'school_branch', 'student_class', 'division', 'roll_number',
            'academic_year', 'gr_number', 'previous_school', 'stream', 'school_board',
            # C. Contact Details
            'student_mobile', 'school_email', 'personal_email', 'address',
            # D. Skill Lab Details
            'enrollment_date', 'skills_enrolled', 'current_skill_level', 'assigned_trainer',
            'batch_timing', 'learning_style', 'interests_aptitude', 'preferred_language',
            'practice_hours', 'certificates_earned', 'badges_earned',
            # E. Health & Safety
            'medical_conditions', 'allergies', 'emergency_instructions',
            'doctor_name', 'doctor_contact', 'physical_limitations',
            # F. Emergency Contact
            'emergency_name', 'emergency_relationship', 'emergency_mobile',
            'emergency_alt_mobile', 'emergency_address',
            # G. Family / Sibling Details
            'sibling_1_name', 'sibling_1_class_school', 'sibling_1_skill_lab_id',
            'sibling_2_name', 'sibling_2_class_school', 'sibling_2_skill_lab_id',
            'sibling_3_name', 'sibling_3_class_school', 'sibling_3_skill_lab_id',
        ],
        'rows': [
            [
                # A. Basic
                'Aarav', 'Kumar', 'Rao', 'Male', '2010-06-15',
                'Indian', 'Hindi', 'O+', '123456789012',
                # B. Academic
                'Delhi Public School', '', '8', 'A', '101',
                '2024-2025', 'GR1234567890', '', '', 'CBSE',
                # C. Contact
                '9876543250', 'aarav@school.com', '', '123 Main St Mumbai',
                # D. Skill Lab
                '2024-04-01', '', '', '',
                '', '', '', '',
                '', '', '',
                # E. Health
                '', '', '',
                '', '', '',
                # F. Emergency
                'Rajesh Rao', 'father', '9876543213',
                '', '',
                # G. Siblings
                '', '', '',
                '', '', '',
                '', '', '',
            ],
        ],
    },

    'parent': {
        'headers': [
            # A. Primary Parent / Guardian Details
            'full_name', 'relation_to_student', 'mobile_number', 'alternate_mobile',
            'email', 'occupation', 'organization', 'education_level', 'id_proof',
            # B. Secondary Parent / Guardian
            'secondary_full_name', 'secondary_relation', 'secondary_mobile',
            'secondary_email', 'secondary_occupation', 'preferred_contact',
            # C. Contact & Address
            'residential_address', 'landmark', 'city', 'state', 'pin_code',
            'permanent_address',
            # D. Communication Preferences
            'contact_method', 'preferred_language', 'dnd_timings',
            'whatsapp_consent', 'photo_consent',
            # E. Financial & Administrative
            'fee_category', 'payment_mode', 'billing_email', 'gst_number',
            # F. Emergency Contacts
            'emergency_name', 'emergency_relation', 'emergency_phone',
            'emergency_address',
            # G. Parent Involvement
            'meeting_availability', 'volunteer_interest', 'parent_skills',
        ],
        'rows': [
            [
                # A. Primary
                'Rajesh Rao', 'father', '9876543213', '',
                'rajesh@example.com', 'Engineer', 'TCS', 'graduate', '',
                # B. Secondary
                'Sunita Rao', 'mother', '9876543299',
                '', '', 'primary',
                # C. Address
                '123 Main St', '', 'Mumbai', 'Maharashtra', '400001',
                '',
                # D. Communication
                'whatsapp', 'hindi', '',
                'yes', 'yes',
                # E. Financial
                'regular', '', '', '',
                # F. Emergency
                'Amit Rao', 'uncle', '9876543214',
                '',
                # G. Involvement
                '', '', '',
            ],
        ],
    },

    'coordinator': {
        'headers': [
            # Basic Information
            'full_name', 'gender', 'date_of_birth', 'blood_group', 'nationality',
            'aadhar_number', 'pan_number',
            # Professional Details
            'designation', 'qualification', 'specialization', 'total_experience',
            'program_management_exp', 'education_exp', 'previous_organizations',
            'languages_known', 'certifications',
            # Contact Information
            'mobile_number', 'alternate_number', 'official_email', 'personal_email',
            # Address Details
            'current_address', 'permanent_address', 'city', 'state', 'pincode',
            # Compliance & Documentation
            'id_proof', 'address_proof', 'police_verification',
            'passport_photo_uploaded', 'contract_uploaded', 'pan_aadhar_linked', 'nda_signed',
            # Program & Work Assignment
            'program_assigned', 'zone_assigned', 'branch_region',
            'reporting_manager', 'login_role',
            'joining_date', 'employment_type', 'contract_start_date', 'contract_end_date',
            # Bank & Payroll Details
            'bank_name', 'branch_name', 'account_number', 'ifsc_code',
            # Additional Optional Data
            'strength_areas', 'hobbies', 'work_style', 'tools_comfortable',
            'achievements', 'career_aspirations',
        ],
        'rows': [
            [
                # Basic
                'Meera Joshi', 'Female', '1985-07-22', 'A+', 'Indian',
                '123456789012', 'ABCDE1234F',
                # Professional
                'Program Coordinator', 'MBA', 'Education', '10 years',
                '5 years', '3 years', '',
                'English, Hindi', '',
                # Contact
                '9876543215', '', 'meera@example.com', '',
                # Address
                '321 Elm St', '', 'Bangalore', 'Karnataka', '560001',
                # Compliance
                '', '', 'Pending',
                'No', 'No', 'No', 'No',
                # Program & Work
                'neoRISE', 'South Zone', '',
                'Ramesh Kumar', '',
                '2024-01-15', 'Full-time', '', '',
                # Bank
                'SBI', 'Koramangala', '12345678901234', 'SBIN0001234',
                # Additional
                '', '', '', '',
                '', '',
            ],
        ],
    },
}

ROLE_LABELS = {
    'school_admin': 'School Admin',
    'teacher': 'Teacher',
    'student': 'Student',
    'parent': 'Parent',
    'coordinator': 'Program Coordinator',
}


# ============================================================
# SAMPLE CSV DOWNLOAD
# ============================================================

@login_required
@user_passes_test(is_superadmin)
def download_sample_csv(request, role):
    if role not in SAMPLE_DATA:
        return JsonResponse({'error': 'Invalid role'}, status=400)

    data = SAMPLE_DATA[role]
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="sample_{role}_import.csv"'

    writer = csv.writer(response)
    writer.writerow(data['headers'])
    for row in data['rows']:
        writer.writerow(row)

    return response


# ============================================================
# BULK IMPORT PROCESSOR
# ============================================================

@login_required
@user_passes_test(is_superadmin)
def bulk_import(request, role):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    if role not in SAMPLE_DATA:
        return JsonResponse({'error': 'Invalid role'}, status=400)

    csv_file = request.FILES.get('csv_file')
    if not csv_file:
        return JsonResponse({'error': 'No file uploaded'}, status=400)

    if not csv_file.name.endswith('.csv'):
        return JsonResponse({'error': 'Please upload a CSV file'}, status=400)

    try:
        decoded = csv_file.read().decode('utf-8-sig')
        reader = csv.DictReader(io.StringIO(decoded))
        rows = list(reader)
    except Exception as e:
        return JsonResponse({'error': f'Error reading CSV: {str(e)}'}, status=400)

    if not rows:
        return JsonResponse({'error': 'CSV file is empty'}, status=400)

    # Validate headers
    expected = set(SAMPLE_DATA[role]['headers'])
    actual = set(rows[0].keys())
    missing = expected - actual
    if missing:
        return JsonResponse({'error': f'Missing columns: {", ".join(sorted(missing))}'}, status=400)

    # Process each row
    results = []
    success_count = 0
    fail_count = 0

    processor = ROLE_PROCESSORS[role]

    for i, row in enumerate(rows):
        # Strip whitespace from all values
        row = {k: (v.strip() if v else '') for k, v in row.items()}
        try:
            processor(row, request.user)
            success_count += 1
            results.append({'row': i + 1, 'name': _get_display_name(row, role), 'status': 'success'})
        except Exception as e:
            fail_count += 1
            results.append({'row': i + 1, 'name': _get_display_name(row, role), 'status': 'failed', 'reason': str(e)})

    return JsonResponse({
        'total': len(rows),
        'success': success_count,
        'failed': fail_count,
        'results': results,
    })


def _get_display_name(row, role):
    if role == 'student':
        return f"{row.get('first_name', '')} {row.get('last_name', '')}".strip()
    return row.get('full_name', row.get('email', 'Row'))


# ============================================================
# PER-ROLE PROCESSORS
# ============================================================

def _process_school_admin(row, created_by):
    from school_admin.models import SchoolAdmin

    full_name = row.get('full_name', '')
    email = row.get('email', '')
    phone = row.get('phone', '')
    gender = row.get('gender', '')
    school_name = row.get('school_name', '')

    if not full_name:
        raise ValueError('full_name is required')
    if not email:
        raise ValueError('email is required')
    if not phone:
        raise ValueError('phone is required')
    if not gender:
        raise ValueError('gender is required')
    if not school_name:
        raise ValueError('school_name is required')

    school = School.objects.filter(school_name__iexact=school_name).first()
    if not school:
        raise ValueError(f'School "{school_name}" not found')

    if SchoolAdmin.objects.filter(school=school, is_active=True).exists():
        raise ValueError(f'School "{school_name}" already has an active admin')

    if User.objects.filter(username=email).exists():
        raise ValueError(f'Email "{email}" already exists')

    password = generate_password()
    name_parts = full_name.split(' ', 1)

    with transaction.atomic():
        user = User.objects.create_user(
            username=email, email=email, password=password,
            first_name=name_parts[0],
            last_name=name_parts[1] if len(name_parts) > 1 else '',
            role='SCHOOL_ADMIN',
        )

        SchoolAdmin.objects.create(
            user=user,
            full_name=full_name,
            email=email,
            phone=phone,
            gender=gender.lower(),
            school=school,
            date_of_birth=_parse_date(row.get('date_of_birth')),
            address=_opt(row.get('address')),
            city=_opt(row.get('city')),
            state=_opt(row.get('state')),
            pincode=_opt(row.get('pincode')),
            account_status='pending',
            is_active=True,
            temporary_password=password,
            created_by=created_by,
        )

    _send_welcome_email(email, full_name, password, 'School Admin')


def _process_teacher(row, created_by):
    from teacher.models import Teacher

    required = ['full_name', 'gender', 'date_of_birth', 'designation', 'qualification',
                'total_experience', 'mobile_number', 'official_email', 'current_address',
                'city', 'state', 'pin_code', 'emergency_contact_name', 'emergency_relation',
                'emergency_mobile', 'joining_date', 'employment_type']

    for field in required:
        if not row.get(field):
            raise ValueError(f'{field} is required')

    email = row['official_email']
    if User.objects.filter(username=email).exists():
        raise ValueError(f'Email "{email}" already exists')

    school = None
    school_name = row.get('school_name', '')
    if school_name:
        school = School.objects.filter(school_name__iexact=school_name).first()
        if not school:
            raise ValueError(f'School "{school_name}" not found')

    password = generate_password()
    name_parts = row['full_name'].split(' ', 1)
    year = datetime.now().year
    emp_id = f"EMP{year}{''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))}"

    with transaction.atomic():
        user = User.objects.create_user(
            username=email, email=email, password=password,
            first_name=name_parts[0],
            last_name=name_parts[1] if len(name_parts) > 1 else '',
            role='THINKING_COACH',
        )

        Teacher.objects.create(
            user=user,
            school=school,
            employee_id=emp_id,
            # A. Basic Information
            full_name=row['full_name'],
            gender=row['gender'].lower(),
            date_of_birth=_parse_date(row['date_of_birth']),
            blood_group=_opt(row.get('blood_group')),
            nationality=row.get('nationality') or 'Indian',
            aadhar_number=_opt(row.get('aadhar_number')),
            pan_number=(_opt(row.get('pan_number')) or '').upper() or None,
            # B. Professional Details
            designation=row['designation'],
            qualification=row['qualification'],
            specialization=_opt(row.get('specialization')),
            total_experience=row['total_experience'],
            skill_training_experience=_opt(row.get('skill_training_experience')),
            previous_organizations=_opt(row.get('previous_organizations')),
            certifications=_opt(row.get('certifications')),
            languages_known=_opt(row.get('languages_known')),
            grades_taught=_opt(row.get('grades_taught')),
            training_style=_opt(row.get('training_style')),
            # C. Contact Information
            mobile_number=row['mobile_number'],
            alternate_number=_opt(row.get('alternate_number')),
            official_email=email,
            personal_email=_opt(row.get('personal_email')),
            # D. Address Details
            current_address=row['current_address'],
            permanent_address=_opt(row.get('permanent_address')),
            city=row['city'],
            state=row['state'],
            pin_code=row['pin_code'],
            # E. Skill Lab Work Details
            skill_lab_center=_opt(row.get('skill_lab_center')),
            branch_location=_opt(row.get('branch_location')),
            batch_timings=_opt(row.get('batch_timings')),
            weekly_timetable=_opt(row.get('weekly_timetable')),
            student_groups=_opt(row.get('student_groups')),
            modules_assigned=_opt(row.get('modules_assigned')),
            active_classes=_opt(row.get('active_classes')),
            total_students=_opt_int(row.get('total_students'), 0),
            dashboard_role=_opt(row.get('dashboard_role')),
            joining_date=_parse_date(row['joining_date']),
            contract_end_date=_parse_date(row.get('contract_end_date')),
            employment_type=row['employment_type'],
            # F. Emergency Information
            emergency_contact_name=row['emergency_contact_name'],
            emergency_relation=row['emergency_relation'],
            emergency_mobile=row['emergency_mobile'],
            emergency_secondary=_opt(row.get('emergency_secondary')),
            health_notes=_opt(row.get('health_notes')),
            # G. Compliance & Documentation
            id_proof_submitted=_opt(row.get('id_proof_submitted')),
            address_proof_submitted=_opt(row.get('address_proof_submitted')),
            police_verification=_opt(row.get('police_verification')),
            contract_uploaded=_opt(row.get('contract_uploaded')),
            pan_aadhar_linked=_opt(row.get('pan_aadhar_linked')),
            bank_details_submitted=_opt(row.get('bank_details_submitted')),
            # H. Bank Details
            bank_name=_opt(row.get('bank_name')),
            branch_name=_opt(row.get('branch_name')),
            bank_account_number=_opt(row.get('bank_account_number')),
            ifsc_code=(_opt(row.get('ifsc_code')) or '').upper() or None,
            # I. Additional Optional Data
            hobbies=_opt(row.get('hobbies')),
            strength_areas=_opt(row.get('strength_areas')),
            improvement_areas=_opt(row.get('improvement_areas')),
            training_resources=_opt(row.get('training_resources')),
            achievements=_opt(row.get('achievements')),
        )

    _send_welcome_email(email, row['full_name'], password, 'Thinking Coach')


def _process_student(row, created_by):
    from student.models import Student

    required = ['first_name', 'last_name', 'gender', 'date_of_birth', 'school_board',
                'student_class', 'division', 'roll_number', 'academic_year', 'gr_number',
                'school_email', 'enrollment_date', 'emergency_name', 'emergency_relationship',
                'emergency_mobile']

    for field in required:
        if not row.get(field):
            raise ValueError(f'{field} is required')

    email = row['school_email']
    gr_number = row['gr_number']

    if User.objects.filter(username=email).exists():
        raise ValueError(f'Email "{email}" already exists')

    if Student.objects.filter(gr_number=gr_number).exists():
        raise ValueError(f'GR Number "{gr_number}" already exists')

    school = None
    school_name = row.get('school_name', '')
    if school_name:
        school = School.objects.filter(school_name__iexact=school_name).first()
        if not school:
            raise ValueError(f'School "{school_name}" not found')

    password = generate_password()
    year = datetime.now().year
    reg_id = f"SKILL{year}{''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))}"

    with transaction.atomic():
        user = User.objects.create_user(
            username=email, email=email, password=password,
            first_name=row['first_name'],
            last_name=row['last_name'],
            role='STUDENT',
        )

        Student.objects.create(
            user=user,
            school=school,
            # A. Basic Information
            first_name=row['first_name'],
            middle_name=_opt(row.get('middle_name')),
            last_name=row['last_name'],
            gender=row['gender'].lower(),
            date_of_birth=_parse_date(row['date_of_birth']),
            nationality=row.get('nationality') or 'Indian',
            mother_tongue=_opt(row.get('mother_tongue')),
            blood_group=_opt(row.get('blood_group')),
            aadhar_number=_opt(row.get('aadhar_number')),
            # B. Academic Details
            school_name=school.school_name if school else (school_name or None),
            school_branch=_opt(row.get('school_branch')),
            student_class=row['student_class'],
            division=row['division'],
            roll_number=row['roll_number'],
            academic_year=row['academic_year'],
            gr_number=gr_number,
            previous_school=_opt(row.get('previous_school')),
            stream=_opt(row.get('stream')),
            school_board=row['school_board'],
            # C. Contact Details
            student_mobile=_opt(row.get('student_mobile')),
            school_email=email,
            personal_email=_opt(row.get('personal_email')),
            address=_opt(row.get('address')),
            # D. Skill Lab Details
            skill_lab_reg_id=reg_id,
            enrollment_date=_parse_date(row['enrollment_date']),
            skills_enrolled=_opt(row.get('skills_enrolled')),
            current_skill_level=_opt(row.get('current_skill_level')),
            assigned_trainer=_opt(row.get('assigned_trainer')),
            batch_timing=_opt(row.get('batch_timing')),
            learning_style=_opt(row.get('learning_style')),
            interests_aptitude=_opt(row.get('interests_aptitude')),
            preferred_language=_opt(row.get('preferred_language')),
            practice_hours=_opt_int(row.get('practice_hours'), 0),
            certificates_earned=_opt(row.get('certificates_earned')),
            badges_earned=_opt(row.get('badges_earned')),
            # E. Health & Safety
            medical_conditions=_opt(row.get('medical_conditions')),
            allergies=_opt(row.get('allergies')),
            emergency_instructions=_opt(row.get('emergency_instructions')),
            doctor_name=_opt(row.get('doctor_name')),
            doctor_contact=_opt(row.get('doctor_contact')),
            physical_limitations=_opt(row.get('physical_limitations')),
            # F. Emergency Contact
            emergency_name=row['emergency_name'],
            emergency_relationship=row['emergency_relationship'],
            emergency_mobile=row['emergency_mobile'],
            emergency_alt_mobile=_opt(row.get('emergency_alt_mobile')),
            emergency_address=_opt(row.get('emergency_address')),
            # G. Family / Sibling Details
            sibling_1_name=_opt(row.get('sibling_1_name')),
            sibling_1_class_school=_opt(row.get('sibling_1_class_school')),
            sibling_1_skill_lab_id=_opt(row.get('sibling_1_skill_lab_id')),
            sibling_2_name=_opt(row.get('sibling_2_name')),
            sibling_2_class_school=_opt(row.get('sibling_2_class_school')),
            sibling_2_skill_lab_id=_opt(row.get('sibling_2_skill_lab_id')),
            sibling_3_name=_opt(row.get('sibling_3_name')),
            sibling_3_class_school=_opt(row.get('sibling_3_class_school')),
            sibling_3_skill_lab_id=_opt(row.get('sibling_3_skill_lab_id')),
        )

    _send_welcome_email(email, f"{row['first_name']} {row['last_name']}", password, 'Student')


def _process_parent(row, created_by):
    from parent.models import Parent

    required = ['full_name', 'relation_to_student', 'mobile_number', 'email',
                'residential_address', 'city', 'state', 'pin_code',
                'emergency_name', 'emergency_relation', 'emergency_phone']

    for field in required:
        if not row.get(field):
            raise ValueError(f'{field} is required')

    email = row['email']
    if User.objects.filter(username=email).exists():
        raise ValueError(f'Email "{email}" already exists')

    password = generate_password()
    name_parts = row['full_name'].split(' ', 1)

    with transaction.atomic():
        user = User.objects.create_user(
            username=email, email=email, password=password,
            first_name=name_parts[0],
            last_name=name_parts[1] if len(name_parts) > 1 else '',
            role='PARENT',
        )

        Parent.objects.create(
            user=user,
            # A. Primary Parent / Guardian Details
            full_name=row['full_name'],
            relation_to_student=row['relation_to_student'].lower(),
            mobile_number=row['mobile_number'],
            alternate_mobile=_opt(row.get('alternate_mobile')),
            email=email,
            occupation=_opt(row.get('occupation')),
            organization=_opt(row.get('organization')),
            education_level=_opt(row.get('education_level')),
            id_proof=_opt(row.get('id_proof')),
            # B. Secondary Parent / Guardian
            secondary_full_name=_opt(row.get('secondary_full_name')),
            secondary_relation=_opt(row.get('secondary_relation')),
            secondary_mobile=_opt(row.get('secondary_mobile')),
            secondary_email=_opt(row.get('secondary_email')),
            secondary_occupation=_opt(row.get('secondary_occupation')),
            preferred_contact=row.get('preferred_contact') or 'primary',
            # C. Contact & Address
            residential_address=row['residential_address'],
            landmark=_opt(row.get('landmark')),
            city=row['city'],
            state=row['state'],
            pin_code=row['pin_code'],
            permanent_address=_opt(row.get('permanent_address')),
            # D. Communication Preferences
            contact_method=row.get('contact_method') or 'whatsapp',
            preferred_language=row.get('preferred_language') or 'english',
            dnd_timings=_opt(row.get('dnd_timings')),
            whatsapp_consent=_opt_bool(row.get('whatsapp_consent'), True),
            photo_consent=_opt_bool(row.get('photo_consent'), True),
            # E. Financial & Administrative
            fee_category=row.get('fee_category') or 'regular',
            payment_mode=_opt(row.get('payment_mode')),
            billing_email=_opt(row.get('billing_email')),
            gst_number=_opt(row.get('gst_number')),
            # F. Emergency Contacts
            emergency_name=row['emergency_name'],
            emergency_relation=row['emergency_relation'],
            emergency_phone=row['emergency_phone'],
            emergency_address=_opt(row.get('emergency_address')),
            # G. Parent Involvement
            meeting_availability=_opt(row.get('meeting_availability')),
            volunteer_interest=_opt(row.get('volunteer_interest')),
            parent_skills=_opt(row.get('parent_skills')),
            # Status
            account_status='pending',
            is_active=True,
        )

    _send_welcome_email(email, row['full_name'], password, 'Parent')


def _process_coordinator(row, created_by):
    from coordinator.models import ProgramCoordinator

    required = ['full_name', 'gender', 'date_of_birth', 'aadhar_number', 'pan_number',
                'designation', 'qualification', 'specialization', 'total_experience',
                'languages_known', 'mobile_number', 'official_email', 'current_address',
                'city', 'state', 'pincode', 'bank_name', 'branch_name', 'account_number',
                'ifsc_code', 'joining_date', 'employment_type']

    for field in required:
        if not row.get(field):
            raise ValueError(f'{field} is required')

    email = row['official_email']
    if User.objects.filter(username=email).exists():
        raise ValueError(f'Email "{email}" already exists')

    password = generate_password()
    name_parts = row['full_name'].split(' ', 1)
    year = datetime.now().year
    emp_id = f"EMP{year}{''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))}"

    with transaction.atomic():
        user = User.objects.create_user(
            username=email, email=email, password=password,
            first_name=name_parts[0],
            last_name=name_parts[1] if len(name_parts) > 1 else '',
            role='PROGRAM_COORDINATOR',
        )

        ProgramCoordinator.objects.create(
            user=user,
            employee_id=emp_id,
            # Basic Information
            full_name=row['full_name'],
            gender=row['gender'].lower(),
            date_of_birth=_parse_date(row['date_of_birth']),
            blood_group=_opt(row.get('blood_group')),
            nationality=row.get('nationality') or 'Indian',
            aadhar_number=row['aadhar_number'],
            pan_number=row['pan_number'].upper(),
            # Professional Details
            designation=row['designation'],
            qualification=row['qualification'],
            specialization=row['specialization'],
            total_experience=row['total_experience'],
            program_management_exp=_opt(row.get('program_management_exp')),
            education_exp=_opt(row.get('education_exp')),
            previous_organizations=_opt(row.get('previous_organizations')),
            languages_known=row['languages_known'],
            certifications=_opt(row.get('certifications')),
            # Contact Information
            mobile_number=row['mobile_number'],
            alternate_number=_opt(row.get('alternate_number')),
            official_email=email,
            personal_email=_opt(row.get('personal_email')),
            # Address Details
            current_address=row['current_address'],
            permanent_address=_opt(row.get('permanent_address')),
            city=row['city'],
            state=row['state'],
            pincode=row['pincode'],
            # Compliance & Documentation
            id_proof=_opt(row.get('id_proof')),
            address_proof=_opt(row.get('address_proof')),
            police_verification=row.get('police_verification') or 'Pending',
            passport_photo_uploaded=row.get('passport_photo_uploaded') or 'No',
            contract_uploaded=row.get('contract_uploaded') or 'No',
            pan_aadhar_linked=row.get('pan_aadhar_linked') or 'No',
            nda_signed=row.get('nda_signed') or 'No',
            # Program & Work Assignment
            program_assigned=_opt(row.get('program_assigned')),
            zone_assigned=_opt(row.get('zone_assigned')),
            branch_region=_opt(row.get('branch_region')),
            reporting_manager=_opt(row.get('reporting_manager')),
            login_role=_opt(row.get('login_role')),
            joining_date=_parse_date(row['joining_date']),
            employment_type=row['employment_type'],
            contract_start_date=_parse_date(row.get('contract_start_date')),
            contract_end_date=_parse_date(row.get('contract_end_date')),
            # Bank & Payroll Details
            bank_name=row['bank_name'],
            branch_name=row['branch_name'],
            account_number=row['account_number'],
            ifsc_code=row['ifsc_code'].upper(),
            # Additional Optional Data
            strength_areas=_opt(row.get('strength_areas')),
            hobbies=_opt(row.get('hobbies')),
            work_style=_opt(row.get('work_style')),
            tools_comfortable=_opt(row.get('tools_comfortable')),
            achievements=_opt(row.get('achievements')),
            career_aspirations=_opt(row.get('career_aspirations')),
        )

    _send_welcome_email(email, row['full_name'], password, 'Program Coordinator')


# ============================================================
# HELPERS
# ============================================================

def _parse_date(value):
    if not value or not value.strip():
        return None
    value = value.strip()
    for fmt in ('%Y-%m-%d', '%d-%m-%Y', '%d/%m/%Y', '%Y/%m/%d'):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    raise ValueError(f'Invalid date format: "{value}". Use YYYY-MM-DD')


def _send_welcome_email(email, name, password, role_label):
    try:
        send_mail(
            subject=f'Welcome to Enpower Skill Lab — {role_label} Account',
            message=f'Hello {name},\n\nYour {role_label} account has been created.\n\nLogin: {email}\nPassword: {password}\n\nPlease change your password after first login.\n\nTeam Enpower Skill Lab',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
    except Exception:
        pass  # Email failure should not block import


ROLE_PROCESSORS = {
    'school_admin': _process_school_admin,
    'teacher': _process_teacher,
    'student': _process_student,
    'parent': _process_parent,
    'coordinator': _process_coordinator,
}
