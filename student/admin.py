from django.contrib import admin
from student.models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('gr_number', 'full_name', 'student_class', 'division', 'school', 'school_email', 'is_active', 'created_at')
    list_filter = ('is_active', 'gender', 'student_class', 'school_board', 'attendance_status', 'current_skill_level', 'created_at')
    search_fields = ('first_name', 'last_name', 'gr_number', 'school_email', 'student_mobile', 'skill_lab_reg_id')
    readonly_fields = ('skill_lab_reg_id', 'created_at', 'updated_at', 'created_by')
    ordering = ['-created_at']

    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = 'Full Name'
