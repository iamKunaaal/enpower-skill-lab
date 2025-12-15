from django.contrib import admin
from .models import SchoolAdmin


@admin.register(SchoolAdmin)
class SchoolAdminAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'school', 'account_status', 'is_active', 'created_at')
    list_filter = ('account_status', 'is_active', 'gender', 'created_at')
    search_fields = ('full_name', 'email', 'phone', 'school__school_name')
    readonly_fields = ('created_at', 'updated_at', 'first_login', 'last_login')

    fieldsets = (
        ('User Account', {
            'fields': ('user', 'account_status', 'is_active')
        }),
        ('Personal Information', {
            'fields': ('full_name', 'email', 'phone', 'profile_photo', 'gender', 'date_of_birth')
        }),
        ('Address', {
            'fields': ('address', 'city', 'state', 'pincode'),
            'classes': ('collapse',)
        }),
        ('School Assignment', {
            'fields': ('school',)
        }),
        ('Password Management', {
            'fields': ('temporary_password', 'password_changed'),
            'classes': ('collapse',)
        }),
        ('Tracking', {
            'fields': ('created_by', 'created_at', 'updated_at', 'first_login', 'last_login'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'school', 'created_by')
