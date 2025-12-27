from django.contrib import admin
from .models import SuperAdmin


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
