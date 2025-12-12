from django.contrib import admin
from .models import School


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    """
    Admin interface for School model with comprehensive display and filtering.
    """
    list_display = [
        'school_name', 
        'school_code', 
        'board', 
        'school_type',
        'city', 
        'state',
        'is_active',
        'onboarding_completed',
        'created_at'
    ]
    
    list_filter = [
        'board',
        'school_type',
        'medium',
        'is_active',
        'onboarding_completed',
        'state',
        'created_at',
    ]
    
    search_fields = [
        'school_name',
        'school_code',
        'city',
        'state',
        'principal_name',
        'school_email',
    ]
    
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'school_name', 'school_code', 'board', 'school_type', 
                'medium', 'year_established', 'school_logo', 'school_email',
                'school_phone', 'website'
            )
        }),
        ('Principal Details', {
            'fields': ('principal_name', 'principal_phone', 'principal_email')
        }),
        ('Branch Details', {
            'fields': (
                'branch_name', 'branch_code', 'branch_address', 'city', 
                'state', 'pincode', 'num_students', 'num_teachers', 
                'num_trainers', 'grades_available', 'shift_details',
                'branch_coordinator_name', 'branch_coordinator_phone'
            )
        }),
        ('Infrastructure', {
            'fields': (
                'csl_availability', 'csl_rooms_count', 'equipment_inventory',
                'computer_lab_details', 'internet_details', 'classroom_count',
                'sports_facilities', 'safety_measures', 'cctv_coverage',
                'fire_safety_status', 'first_aid_availability'
            ),
            'classes': ['collapse']
        }),
        ('Academic Information', {
            'fields': (
                'total_students', 'class_wise_strength', 'student_teacher_ratio',
                'curriculum_followed', 'club_details', 'skill_subjects',
                'remedial_programs'
            ),
            'classes': ['collapse']
        }),
        ('Skill Lab Integration', {
            'fields': (
                'skill_lab_reg_id', 'skills_offered', 'batch_timings',
                'trainers_assigned', 'lab_usage_hours', 'student_groups_linked',
                'csl_integration_status', 'csl_project_list', 'assessment_system_linked'
            ),
            'classes': ['collapse']
        }),
        ('Administrative', {
            'fields': (
                'billing_email', 'gst_number', 'payment_preferences',
                'finance_contact', 'admin_coordinator_name', 'admin_coordinator_phone',
                'academic_year_cycle', 'workshop_approval_status', 'digital_reports_consent'
            ),
            'classes': ['collapse']
        }),
        ('Compliance & Documentation', {
            'fields': (
                'affiliation_letter', 'fire_safety_cert', 'registration_cert',
                'trust_registration', 'lab_safety_compliance', 'teacher_police_verification',
                'child_safety_policy', 'insurance_docs'
            ),
            'classes': ['collapse']
        }),
        ('Emergency Information', {
            'fields': (
                'emergency_contact_person', 'emergency_phone', 'nearest_hospital',
                'evacuation_plan'
            ),
            'classes': ['collapse']
        }),
        ('Additional Data', {
            'fields': (
                'awards', 'notable_alumni', 'performance_trends',
                'social_media_links', 'events_calendar'
            ),
            'classes': ['collapse']
        }),
        ('System Information', {
            'fields': ('is_active', 'onboarding_completed', 'created_at', 'updated_at')
        }),
    )
    
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    actions = ['mark_as_active', 'mark_as_inactive', 'mark_onboarding_complete']
    
    def mark_as_active(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} school(s) marked as active.')
    mark_as_active.short_description = "Mark selected schools as active"
    
    def mark_as_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} school(s) marked as inactive.')
    mark_as_inactive.short_description = "Mark selected schools as inactive"
    
    def mark_onboarding_complete(self, request, queryset):
        updated = queryset.update(onboarding_completed=True)
        self.message_user(request, f'{updated} school(s) marked as onboarding complete.')
    mark_onboarding_complete.short_description = "Mark onboarding as complete"
