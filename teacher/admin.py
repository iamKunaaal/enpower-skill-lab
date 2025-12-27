from django.contrib import admin
from teacher.models import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'employee_id', 'designation', 'school', 'is_active', 'created_at')
    list_filter = ('is_active', 'designation', 'employment_type', 'gender', 'school')
    search_fields = ('full_name', 'employee_id', 'official_email', 'mobile_number')
    ordering = ['-created_at']
