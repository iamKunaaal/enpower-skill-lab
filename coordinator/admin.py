from django.contrib import admin
from .models import ProgramCoordinator


@admin.register(ProgramCoordinator)
class ProgramCoordinatorAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'employee_id', 'designation', 'mobile_number', 'official_email', 'is_active', 'created_at']
    list_filter = ['designation', 'employment_type', 'is_active', 'gender', 'created_at']
    search_fields = ['full_name', 'employee_id', 'mobile_number', 'official_email', 'aadhar_number', 'pan_number']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['schools_assigned']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'profile_photo', 'full_name', 'gender', 'date_of_birth', 'blood_group', 'nationality', 'employee_id', 'aadhar_number', 'pan_number')
        }),
        ('Professional Details', {
            'fields': ('designation', 'qualification', 'specialization', 'total_experience', 'program_management_exp', 'education_exp', 'previous_organizations', 'languages_known', 'certifications', 'resume')
        }),
        ('Contact Information', {
            'fields': ('mobile_number', 'alternate_number', 'official_email', 'personal_email')
        }),
        ('Address Details', {
            'fields': ('current_address', 'permanent_address', 'city', 'state', 'pincode')
        }),
        ('Compliance & Documentation', {
            'fields': ('id_proof', 'address_proof', 'police_verification', 'passport_photo_uploaded', 'contract_uploaded', 'pan_aadhar_linked', 'nda_signed')
        }),
        ('Program & Work Assignment', {
            'fields': ('program_assigned', 'zone_assigned', 'schools_assigned', 'branch_region', 'reporting_manager', 'login_role', 'joining_date', 'employment_type', 'contract_start_date', 'contract_end_date')
        }),
        ('Bank & Payroll Details', {
            'fields': ('bank_name', 'branch_name', 'account_number', 'ifsc_code', 'bank_proof')
        }),
        ('Additional Data', {
            'fields': ('strength_areas', 'hobbies', 'work_style', 'tools_comfortable', 'achievements', 'career_aspirations'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('is_active', 'last_password_change', 'created_at', 'updated_at', 'created_by'),
            'classes': ('collapse',)
        }),
    )
