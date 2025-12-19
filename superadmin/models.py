from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from schools.models import School

User = get_user_model()


class SuperAdmin(models.Model):
    """
    Super Admin profile model to store additional information
    beyond the base User model
    """
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer-not-to-say', 'Prefer not to say'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='superadmin_profile'
    )
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_photo = models.ImageField(
        upload_to='superadmin/profile_photos/',
        blank=True,
        null=True
    )

    # Account metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)
    last_password_change = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'superadmin_profiles'
        verbose_name = 'Super Admin Profile'
        verbose_name_plural = 'Super Admin Profiles'

    def __str__(self):
        return f"{self.full_name} - Super Admin"


class Student(models.Model):
    """
    Student model for onboarding and managing student information
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

    STREAM_CHOICES = [
        ('science', 'Science'),
        ('commerce', 'Commerce'),
        ('arts', 'Arts/Humanities'),
        ('na', 'Not Applicable'),
    ]

    SCHOOL_BOARD_CHOICES = [
        ('CBSE', 'CBSE'),
        ('ICSE', 'ICSE'),
        ('SSC', 'SSC (State Board)'),
        ('IB', 'IB (International Baccalaureate)'),
        ('IGCSE', 'IGCSE'),
        ('other', 'Other'),
    ]

    SKILL_LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    LEARNING_STYLE_CHOICES = [
        ('visual', 'Visual'),
        ('auditory', 'Auditory'),
        ('kinesthetic', 'Kinesthetic'),
        ('mixed', 'Mixed'),
    ]

    LANGUAGE_CHOICES = [
        ('english', 'English'),
        ('hindi', 'Hindi'),
        ('marathi', 'Marathi'),
        ('other', 'Other'),
    ]

    ATTENDANCE_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on-leave', 'On Leave'),
    ]

    EMERGENCY_RELATIONSHIP_CHOICES = [
        ('father', 'Father'),
        ('mother', 'Mother'),
        ('guardian', 'Guardian'),
        ('uncle', 'Uncle'),
        ('aunt', 'Aunt'),
        ('grandparent', 'Grandparent'),
        ('sibling', 'Sibling'),
        ('other', 'Other'),
    ]

    # A. Basic Information
    student_photo = models.ImageField(upload_to='students/photos/', blank=True, null=True)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    nationality = models.CharField(max_length=50, default='Indian')
    mother_tongue = models.CharField(max_length=50, blank=True, null=True)
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)
    aadhar_number = models.CharField(max_length=14, blank=True, null=True)  # Format: XXXX XXXX XXXX

    # User Account Link
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='student_profile')

    # B. School Assignment
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')

    # C. Academic Details
    school_name = models.CharField(max_length=200, blank=True, null=True)  # Deprecated - use school ForeignKey
    school_branch = models.CharField(max_length=100, blank=True, null=True)
    student_class = models.CharField(max_length=10)  # Class 1-12
    division = models.CharField(max_length=10)  # A, B, C, D
    roll_number = models.CharField(max_length=20)
    academic_year = models.CharField(max_length=20)  # e.g., 2024-2025
    gr_number = models.CharField(max_length=50, unique=True)  # GR/Admission number
    previous_school = models.CharField(max_length=200, blank=True, null=True)
    stream = models.CharField(max_length=20, choices=STREAM_CHOICES, blank=True, null=True)
    school_board = models.CharField(max_length=20, choices=SCHOOL_BOARD_CHOICES)

    # C. Contact Details
    student_mobile = models.CharField(max_length=15, blank=True, null=True)
    school_email = models.EmailField(unique=True)  # Used for login
    personal_email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)  # Auto-linked from parent details

    # D. Skill Lab Specific Details
    skill_lab_reg_id = models.CharField(max_length=50, unique=True, blank=True, null=True)  # Auto-generated
    enrollment_date = models.DateField()
    skills_enrolled = models.CharField(max_length=200, blank=True, null=True)
    current_skill_level = models.CharField(max_length=20, choices=SKILL_LEVEL_CHOICES, blank=True, null=True)
    assigned_trainer = models.CharField(max_length=100, blank=True, null=True)
    batch_timing = models.CharField(max_length=100, blank=True, null=True)
    learning_style = models.CharField(max_length=20, choices=LEARNING_STYLE_CHOICES, blank=True, null=True)
    interests_aptitude = models.CharField(max_length=200, blank=True, null=True)
    preferred_language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, blank=True, null=True)
    attendance_status = models.CharField(max_length=20, choices=ATTENDANCE_STATUS_CHOICES, default='active')
    practice_hours = models.IntegerField(default=0, validators=[MinValueValidator(0)])  # Auto-tracked
    certificates_earned = models.TextField(blank=True, null=True)  # Auto-updated
    badges_earned = models.TextField(blank=True, null=True)  # Auto-updated

    # E. Health & Safety
    medical_conditions = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    emergency_instructions = models.TextField(blank=True, null=True)
    doctor_name = models.CharField(max_length=100, blank=True, null=True)
    doctor_contact = models.CharField(max_length=15, blank=True, null=True)
    physical_limitations = models.TextField(blank=True, null=True)

    # F. Emergency Contact
    emergency_name = models.CharField(max_length=100)
    emergency_relationship = models.CharField(max_length=20, choices=EMERGENCY_RELATIONSHIP_CHOICES)
    emergency_mobile = models.CharField(max_length=15)
    emergency_alt_mobile = models.CharField(max_length=15, blank=True, null=True)
    emergency_address = models.TextField(blank=True, null=True)

    # G. Family Details (Optional)
    sibling_1_name = models.CharField(max_length=100, blank=True, null=True)
    sibling_1_class_school = models.CharField(max_length=100, blank=True, null=True)
    sibling_1_skill_lab_id = models.CharField(max_length=50, blank=True, null=True)

    sibling_2_name = models.CharField(max_length=100, blank=True, null=True)
    sibling_2_class_school = models.CharField(max_length=100, blank=True, null=True)
    sibling_2_skill_lab_id = models.CharField(max_length=50, blank=True, null=True)

    sibling_3_name = models.CharField(max_length=100, blank=True, null=True)
    sibling_3_class_school = models.CharField(max_length=100, blank=True, null=True)
    sibling_3_skill_lab_id = models.CharField(max_length=50, blank=True, null=True)

    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='students_created')

    class Meta:
        db_table = 'students'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.gr_number}"

    @property
    def full_name(self):
        """Returns the full name of the student"""
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"

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
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='teacher_profile')

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
    aadhar_number = models.CharField(max_length=14, blank=True, null=True)  # Format: XXXX XXXX XXXX
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
    official_email = models.EmailField(unique=True)  # Used for login
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
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='teachers_created')

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


class Parent(models.Model):
    """
    Parent/Guardian model for onboarding and managing parent information
    """
    RELATION_CHOICES = [
        ('mother', 'Mother'),
        ('father', 'Father'),
        ('guardian', 'Guardian'),
    ]

    SECONDARY_RELATION_CHOICES = [
        ('mother', 'Mother'),
        ('father', 'Father'),
        ('guardian', 'Guardian'),
        ('grandparent', 'Grandparent'),
        ('uncle', 'Uncle'),
        ('aunt', 'Aunt'),
    ]

    EDUCATION_LEVEL_CHOICES = [
        ('high-school', 'High School'),
        ('diploma', 'Diploma'),
        ('graduate', 'Graduate'),
        ('post-graduate', 'Post Graduate'),
        ('doctorate', 'Doctorate'),
        ('other', 'Other'),
    ]

    PREFERRED_CONTACT_CHOICES = [
        ('primary', 'Primary Parent/Guardian'),
        ('secondary', 'Secondary Parent/Guardian'),
        ('both', 'Both'),
    ]

    CONTACT_METHOD_CHOICES = [
        ('call', 'Phone Call'),
        ('whatsapp', 'WhatsApp'),
        ('sms', 'SMS'),
        ('email', 'Email'),
    ]

    LANGUAGE_CHOICES = [
        ('english', 'English'),
        ('hindi', 'Hindi'),
        ('marathi', 'Marathi'),
        ('gujarati', 'Gujarati'),
        ('tamil', 'Tamil'),
        ('telugu', 'Telugu'),
        ('kannada', 'Kannada'),
        ('other', 'Other'),
    ]

    FEE_CATEGORY_CHOICES = [
        ('regular', 'Regular'),
        ('scholarship', 'Scholarship'),
        ('concession', 'Concession'),
    ]

    PAYMENT_MODE_CHOICES = [
        ('online', 'Online Payment'),
        ('bank-transfer', 'Bank Transfer'),
        ('cheque', 'Cheque'),
        ('cash', 'Cash'),
        ('upi', 'UPI'),
    ]

    EMERGENCY_RELATION_CHOICES = [
        ('grandparent', 'Grandparent'),
        ('uncle', 'Uncle'),
        ('aunt', 'Aunt'),
        ('sibling', 'Sibling'),
        ('neighbor', 'Neighbor'),
        ('family-friend', 'Family Friend'),
        ('other', 'Other'),
    ]

    MEETING_AVAILABILITY_CHOICES = [
        ('online', 'Online Only'),
        ('offline', 'Offline Only'),
        ('both', 'Both Online and Offline'),
        ('not-available', 'Not Available'),
    ]

    ACCOUNT_STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending', 'Pending'),
        ('inactive', 'Inactive'),
    ]

    # Parent ID (auto-generated)
    parent_id = models.CharField(max_length=20, unique=True, blank=True)

    # User Account Link
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='parent_profile')

    # A. Primary Parent / Guardian Details
    profile_photo = models.ImageField(upload_to='parents/photos/', blank=True, null=True)
    full_name = models.CharField(max_length=200)
    relation_to_student = models.CharField(max_length=20, choices=RELATION_CHOICES)
    mobile_number = models.CharField(max_length=15)
    alternate_mobile = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)  # Used for login
    occupation = models.CharField(max_length=100, blank=True, null=True)
    organization = models.CharField(max_length=200, blank=True, null=True)
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVEL_CHOICES, blank=True, null=True)
    id_proof = models.CharField(max_length=20, blank=True, null=True)  # Aadhar/PAN

    # B. Secondary Parent / Guardian
    secondary_full_name = models.CharField(max_length=200, blank=True, null=True)
    secondary_relation = models.CharField(max_length=20, choices=SECONDARY_RELATION_CHOICES, blank=True, null=True)
    secondary_mobile = models.CharField(max_length=15, blank=True, null=True)
    secondary_email = models.EmailField(blank=True, null=True)
    secondary_occupation = models.CharField(max_length=100, blank=True, null=True)
    preferred_contact = models.CharField(max_length=20, choices=PREFERRED_CONTACT_CHOICES, default='primary')

    # C. Contact & Address
    residential_address = models.TextField()
    landmark = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=6)
    permanent_address = models.TextField(blank=True, null=True)

    # D. Communication Preferences
    contact_method = models.CharField(max_length=20, choices=CONTACT_METHOD_CHOICES, default='whatsapp')
    preferred_language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='english')
    dnd_timings = models.CharField(max_length=100, blank=True, null=True)
    whatsapp_consent = models.BooleanField(default=True)
    photo_consent = models.BooleanField(default=True)

    # E. Financial & Administrative
    fee_category = models.CharField(max_length=20, choices=FEE_CATEGORY_CHOICES, default='regular')
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, blank=True, null=True)
    billing_email = models.EmailField(blank=True, null=True)
    gst_number = models.CharField(max_length=20, blank=True, null=True)

    # F. Emergency Contacts
    emergency_name = models.CharField(max_length=100)
    emergency_relation = models.CharField(max_length=20, choices=EMERGENCY_RELATION_CHOICES)
    emergency_phone = models.CharField(max_length=15)
    emergency_address = models.TextField(blank=True, null=True)

    # G. Parent Involvement
    meeting_availability = models.CharField(max_length=20, choices=MEETING_AVAILABILITY_CHOICES, blank=True, null=True)
    volunteer_interest = models.CharField(max_length=10, blank=True, null=True)  # yes/no/maybe
    parent_skills = models.TextField(blank=True, null=True)

    # Linked Students (Many-to-Many relationship)
    students = models.ManyToManyField(Student, related_name='parents', blank=True)

    # Account Status
    account_status = models.CharField(max_length=20, choices=ACCOUNT_STATUS_CHOICES, default='pending')

    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='parents_created')

    class Meta:
        db_table = 'parents'
        verbose_name = 'Parent'
        verbose_name_plural = 'Parents'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.parent_id}"

    def save(self, *args, **kwargs):
        if not self.parent_id:
            # Auto-generate parent ID
            import random
            import string
            self.parent_id = 'P' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        super().save(*args, **kwargs)

    @property
    def initials(self):
        """Get initials from full name""" 
        words = self.full_name.strip().split()
        if len(words) >= 2:
            return (words[0][0] + words[1][0]).upper()
        return self.full_name[:2].upper()

    @property
    def children_names(self):
        """Get comma-separated list of children names"""
        return ', '.join([s.full_name for s in self.students.all()])

    @property
    def children_grades(self):
        """Get comma-separated list of children grades"""
        return ', '.join([f"Grade {s.student_class}" for s in self.students.all()])
