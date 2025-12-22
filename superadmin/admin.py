from django.contrib import admin
from .models import SuperAdmin, Student, Teacher, Parent, Lesson, LessonResource, LessonVideo


# SuperAdmin Model Admin
@admin.register(SuperAdmin)
class SuperAdminAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'is_active', 'created_at')
    list_filter = ('is_active', 'gender', 'created_at')
    search_fields = ('full_name', 'email', 'phone')
    readonly_fields = ('created_at', 'updated_at', 'last_login')

    fieldsets = (
        ('Personal Information', {
            'fields': ('user', 'full_name', 'email', 'phone', 'alternate_phone', 'gender', 'date_of_birth', 'profile_photo')
        }),
        ('Account Status', {
            'fields': ('is_active', 'last_login', 'last_password_change')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# Student Model Admin
@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('gr_number', 'full_name', 'student_class', 'division', 'school_name', 'school_email', 'is_active', 'created_at')
    list_filter = ('is_active', 'gender', 'student_class', 'school_board', 'attendance_status', 'current_skill_level', 'created_at')
    search_fields = ('first_name', 'last_name', 'gr_number', 'school_email', 'student_mobile', 'skill_lab_reg_id')
    readonly_fields = ('skill_lab_reg_id', 'age', 'created_at', 'updated_at', 'created_by')

    fieldsets = (
        ('Basic Information', {
            'fields': ('student_photo', 'first_name', 'middle_name', 'last_name', 'gender', 'date_of_birth', 'nationality', 'mother_tongue', 'blood_group', 'aadhar_number')
        }),
        ('Academic Details', {
            'fields': ('school_name', 'school_branch', 'student_class', 'division', 'roll_number', 'academic_year', 'gr_number', 'previous_school', 'stream', 'school_board')
        }),
        ('Contact Details', {
            'fields': ('student_mobile', 'school_email', 'personal_email', 'address')
        }),
        ('Skill Lab Details', {
            'fields': ('skill_lab_reg_id', 'enrollment_date', 'skills_enrolled', 'current_skill_level', 'assigned_trainer', 'batch_timing', 'learning_style', 'interests_aptitude', 'preferred_language', 'attendance_status', 'practice_hours', 'certificates_earned', 'badges_earned')
        }),
        ('Health & Safety', {
            'fields': ('medical_conditions', 'allergies', 'emergency_instructions', 'doctor_name', 'doctor_contact', 'physical_limitations'),
            'classes': ('collapse',)
        }),
        ('Emergency Contact', {
            'fields': ('emergency_name', 'emergency_relationship', 'emergency_mobile', 'emergency_alt_mobile', 'emergency_address'),
            'classes': ('collapse',)
        }),
        ('Family Details', {
            'fields': ('sibling_1_name', 'sibling_1_class_school', 'sibling_1_skill_lab_id', 'sibling_2_name', 'sibling_2_class_school', 'sibling_2_skill_lab_id', 'sibling_3_name', 'sibling_3_class_school', 'sibling_3_skill_lab_id'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('is_active', 'created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )

    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = 'Full Name'


# Teacher Model Admin
@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'full_name', 'designation', 'official_email', 'mobile_number', 'attendance_status', 'is_active', 'created_at')
    list_filter = ('is_active', 'gender', 'designation', 'employment_type', 'attendance_status', 'created_at')
    search_fields = ('full_name', 'employee_id', 'official_email', 'mobile_number', 'aadhar_number')
    readonly_fields = ('employee_id', 'age', 'created_at', 'updated_at', 'created_by')

    fieldsets = (
        ('Basic Information', {
            'fields': ('profile_photo', 'full_name', 'gender', 'date_of_birth', 'blood_group', 'nationality', 'aadhar_number', 'pan_number')
        }),
        ('Professional Details', {
            'fields': ('employee_id', 'designation', 'qualification', 'specialization', 'total_experience', 'skill_training_experience', 'previous_organizations', 'certifications', 'languages_known', 'grades_taught', 'training_style')
        }),
        ('Contact Information', {
            'fields': ('mobile_number', 'alternate_number', 'official_email', 'personal_email')
        }),
        ('Address Details', {
            'fields': ('current_address', 'city', 'state', 'pin_code', 'permanent_address')
        }),
        ('Skill Lab Work Details', {
            'fields': ('skill_lab_center', 'branch_location', 'batch_timings', 'weekly_timetable', 'student_groups', 'modules_assigned', 'active_classes', 'total_students', 'dashboard_role', 'joining_date', 'contract_end_date', 'employment_type')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_relation', 'emergency_mobile', 'emergency_secondary', 'health_notes'),
            'classes': ('collapse',)
        }),
        ('Compliance & Documentation', {
            'fields': ('id_proof_submitted', 'address_proof_submitted', 'police_verification', 'contract_uploaded', 'passport_photo', 'pan_aadhar_linked', 'resume'),
            'classes': ('collapse',)
        }),
        ('Bank Details', {
            'fields': ('bank_details_submitted', 'bank_name', 'bank_account_number', 'ifsc_code', 'branch_name', 'passbook_copy'),
            'classes': ('collapse',)
        }),
        ('Additional Data', {
            'fields': ('hobbies', 'strength_areas', 'improvement_areas', 'training_resources', 'achievements'),
            'classes': ('collapse',)
        }),
        ('Status & Metadata', {
            'fields': ('attendance_status', 'is_active', 'created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )


# Parent Model Admin
@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ('parent_id', 'full_name', 'email', 'mobile_number', 'relation_to_student', 'account_status', 'is_active', 'created_at')
    list_filter = ('is_active', 'account_status', 'relation_to_student', 'fee_category', 'preferred_language', 'created_at')
    search_fields = ('full_name', 'parent_id', 'email', 'mobile_number', 'secondary_full_name')
    readonly_fields = ('parent_id', 'created_at', 'updated_at', 'created_by')
    filter_horizontal = ('students',)

    fieldsets = (
        ('Primary Parent Information', {
            'fields': ('parent_id', 'profile_photo', 'full_name', 'relation_to_student', 'mobile_number', 'alternate_mobile', 'email', 'occupation', 'organization', 'education_level', 'id_proof')
        }),
        ('Secondary Parent Information', {
            'fields': ('secondary_full_name', 'secondary_relation', 'secondary_mobile', 'secondary_email', 'secondary_occupation', 'preferred_contact'),
            'classes': ('collapse',)
        }),
        ('Address', {
            'fields': ('residential_address', 'landmark', 'city', 'state', 'pin_code', 'permanent_address')
        }),
        ('Communication Preferences', {
            'fields': ('contact_method', 'preferred_language', 'dnd_timings', 'whatsapp_consent', 'photo_consent'),
            'classes': ('collapse',)
        }),
        ('Financial', {
            'fields': ('fee_category', 'payment_mode', 'billing_email', 'gst_number'),
            'classes': ('collapse',)
        }),
        ('Emergency Contact', {
            'fields': ('emergency_name', 'emergency_relation', 'emergency_phone', 'emergency_address'),
            'classes': ('collapse',)
        }),
        ('Parent Involvement', {
            'fields': ('meeting_availability', 'volunteer_interest', 'parent_skills'),
            'classes': ('collapse',)
        }),
        ('Linked Students', {
            'fields': ('students',)
        }),
        ('Status & Metadata', {
            'fields': ('account_status', 'is_active', 'created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )


# Lesson Resource Inline
class LessonResourceInline(admin.TabularInline):
    model = LessonResource
    extra = 0
    fields = ('title', 'file', 'resource_type', 'file_size')
    readonly_fields = ('file_size',)


# Lesson Video Inline
class LessonVideoInline(admin.TabularInline):
    model = LessonVideo
    extra = 0
    fields = ('title', 'source', 'url', 'file', 'duration', 'order')


# Lesson Model Admin
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'competency', 'level', 'status', 'is_published', 'view_count', 'completion_count', 'created_at')
    list_filter = ('status', 'level', 'is_published', 'primary_content_type', 'recommend_low_competency', 'created_at')
    search_fields = ('title', 'description', 'competency', 'module')
    readonly_fields = ('view_count', 'completion_count', 'created_at', 'updated_at', 'created_by')
    filter_horizontal = ('applicable_schools',)
    inlines = [LessonVideoInline, LessonResourceInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'thumbnail')
        }),
        ('Assignment', {
            'fields': ('competency', 'level', 'module')
        }),
        ('Lesson Context', {
            'fields': ('applicable_schools', 'applicable_grades')
        }),
        ('Content', {
            'fields': ('primary_content_type', 'video_urls', 'article_content', 'quiz_data'),
            'classes': ('collapse',)
        }),
        ('Visibility & Status', {
            'fields': ('status', 'is_published', 'recommend_low_competency')
        }),
        ('Metrics', {
            'fields': ('view_count', 'completion_count'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )

    actions = ['publish_lessons', 'unpublish_lessons', 'archive_lessons']

    def publish_lessons(self, request, queryset):
        updated = queryset.update(status='published', is_published=True)
        self.message_user(request, f'{updated} lesson(s) published.')
    publish_lessons.short_description = "Publish selected lessons"

    def unpublish_lessons(self, request, queryset):
        updated = queryset.update(status='draft', is_published=False)
        self.message_user(request, f'{updated} lesson(s) unpublished.')
    unpublish_lessons.short_description = "Unpublish selected lessons"

    def archive_lessons(self, request, queryset):
        updated = queryset.update(status='archived', is_published=False)
        self.message_user(request, f'{updated} lesson(s) archived.')
    archive_lessons.short_description = "Archive selected lessons"


# Lesson Resource Model Admin
@admin.register(LessonResource)
class LessonResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'resource_type', 'file_size', 'created_at')
    list_filter = ('resource_type', 'created_at')
    search_fields = ('title', 'lesson__title')
    readonly_fields = ('created_at',)


# Lesson Video Model Admin
@admin.register(LessonVideo)
class LessonVideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'source', 'duration', 'order', 'created_at')
    list_filter = ('source', 'created_at')
    search_fields = ('title', 'lesson__title', 'url')
    readonly_fields = ('created_at',)
