from django.db import models
from django.conf import settings
from schools.models import School


class Teacher(models.Model):
    """
    Teacher/Coach model for onboarding and managing teacher information
    """
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]

    DESIGNATION_CHOICES = [
        ('enpower-trainer', 'ENpower Trainer'),
        ('school-teacher', 'School Teacher'),
        ('head-teacher', 'Head Teacher'),
        ('assistant-teacher', 'Assistant Teacher'),
        ('principal', 'Principal'),
        ('coordinator', 'Program Coordinator'),
    ]

    TRAINING_STYLE_CHOICES = [
        ('interactive', 'Interactive'),
        ('conceptual', 'Conceptual'),
        ('activity-based', 'Activity-Based'),
        ('mixed', 'Mixed Approach'),
    ]

    EMPLOYMENT_TYPE_CHOICES = [
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('visiting', 'Visiting'),
        ('contract', 'Contract'),
    ]

    DASHBOARD_ROLE_CHOICES = [
        ('coach', 'Thinking Coach'),
        ('senior-coach', 'Senior Coach'),
        ('coordinator', 'Program Coordinator'),
        ('admin', 'Admin'),
    ]

    EMERGENCY_RELATION_CHOICES = [
        ('spouse', 'Spouse'),
        ('parent', 'Parent'),
        ('sibling', 'Sibling'),
        ('child', 'Child'),
        ('friend', 'Friend'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
        ('pending', 'Pending'),
    ]

    ATTENDANCE_STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('on-leave', 'On Leave'),
    ]

    # User Account Link
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='teacher_profile')

    # School Assignment
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name='teachers')

    # A. Basic Information
    profile_photo = models.ImageField(upload_to='teachers/photos/', blank=True, null=True)
    employee_id = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=200)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)
    nationality = models.CharField(max_length=50, default='Indian')
    aadhar_number = models.CharField(max_length=14, blank=True, null=True)
    pan_number = models.CharField(max_length=10, blank=True, null=True)

    # B. Professional Details
    designation = models.CharField(max_length=50, choices=DESIGNATION_CHOICES)
    qualification = models.CharField(max_length=200)
    specialization = models.CharField(max_length=200, blank=True, null=True)
    total_experience = models.CharField(max_length=100)
    skill_training_experience = models.CharField(max_length=100, blank=True, null=True)
    previous_organizations = models.TextField(blank=True, null=True)
    certifications = models.TextField(blank=True, null=True)
    languages_known = models.CharField(max_length=200, blank=True, null=True)
    grades_taught = models.CharField(max_length=100, blank=True, null=True)
    training_style = models.CharField(max_length=20, choices=TRAINING_STYLE_CHOICES, blank=True, null=True)

    # C. Contact Information
    mobile_number = models.CharField(max_length=15)
    alternate_number = models.CharField(max_length=15, blank=True, null=True)
    official_email = models.EmailField(unique=True)
    personal_email = models.EmailField(blank=True, null=True)

    # D. Address Details
    current_address = models.TextField()
    permanent_address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=6)

    # E. Skill Lab Work Details
    skill_lab_center = models.CharField(max_length=200, blank=True, null=True)
    branch_location = models.CharField(max_length=200, blank=True, null=True)
    batch_timings = models.CharField(max_length=100, blank=True, null=True)
    weekly_timetable = models.CharField(max_length=200, blank=True, null=True)
    student_groups = models.CharField(max_length=200, blank=True, null=True)
    modules_assigned = models.TextField(blank=True, null=True)
    active_classes = models.CharField(max_length=200, blank=True, null=True)
    total_students = models.IntegerField(default=0, blank=True, null=True)
    dashboard_role = models.CharField(max_length=20, choices=DASHBOARD_ROLE_CHOICES, blank=True, null=True)
    joining_date = models.DateField()
    contract_end_date = models.DateField(blank=True, null=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)

    # F. Emergency Information
    emergency_contact_name = models.CharField(max_length=100)
    emergency_relation = models.CharField(max_length=20, choices=EMERGENCY_RELATION_CHOICES)
    emergency_mobile = models.CharField(max_length=15)
    emergency_secondary = models.CharField(max_length=15, blank=True, null=True)
    health_notes = models.TextField(blank=True, null=True)

    # G. Compliance & Documentation
    id_proof_submitted = models.CharField(max_length=20, blank=True, null=True)
    address_proof_submitted = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True, null=True)
    police_verification = models.CharField(max_length=20, blank=True, null=True)
    contract_uploaded = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True, null=True)
    passport_photo = models.ImageField(upload_to='teachers/passport_photos/', blank=True, null=True)
    pan_aadhar_linked = models.CharField(max_length=20, blank=True, null=True)
    resume = models.FileField(upload_to='teachers/resumes/', blank=True, null=True)
    bank_details_submitted = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True, null=True)
    ifsc_code = models.CharField(max_length=11, blank=True, null=True)
    bank_account_number = models.CharField(max_length=20, blank=True, null=True)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    branch_name = models.CharField(max_length=100, blank=True, null=True)
    passbook_copy = models.FileField(upload_to='teachers/passbooks/', blank=True, null=True)

    # H. Additional Optional Data
    hobbies = models.CharField(max_length=200, blank=True, null=True)
    strength_areas = models.CharField(max_length=200, blank=True, null=True)
    improvement_areas = models.CharField(max_length=200, blank=True, null=True)
    training_resources = models.CharField(max_length=200, blank=True, null=True)
    achievements = models.TextField(blank=True, null=True)

    # Attendance Status
    attendance_status = models.CharField(max_length=20, choices=ATTENDANCE_STATUS_CHOICES, default='present')

    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_password_change = models.DateTimeField(blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='teachers_created')

    class Meta:
        db_table = 'teachers'
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.employee_id}"

    @property
    def age(self):
        """Calculate age from date of birth"""
        from datetime import date
        today = date.today()
        if self.date_of_birth:
            age = today.year - self.date_of_birth.year
            if today.month < self.date_of_birth.month or (today.month == self.date_of_birth.month and today.day < self.date_of_birth.day):
                age -= 1
            return age
        return None

    @property
    def initials(self):
        """Get initials from full name"""
        words = self.full_name.strip().split()
        if len(words) >= 2:
            return (words[0][0] + words[1][0]).upper()
        return self.full_name[:2].upper()
