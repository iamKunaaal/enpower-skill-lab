from django.contrib import admin
from parent.models import Parent


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ('parent_id', 'full_name', 'email', 'mobile_number', 'relation_to_student', 'account_status', 'is_active', 'created_at')
    list_filter = ('is_active', 'account_status', 'relation_to_student', 'fee_category', 'preferred_language', 'created_at')
    search_fields = ('full_name', 'parent_id', 'email', 'mobile_number', 'secondary_full_name')
    readonly_fields = ('parent_id', 'created_at', 'updated_at', 'created_by')
    filter_horizontal = ('students',)
    ordering = ['-created_at']
