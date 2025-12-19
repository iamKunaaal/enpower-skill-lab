"""
Context processors for school_admin app.
Makes SchoolAdmin profile data available in all templates.
"""

def school_admin_profile(request):
    """
    Add SchoolAdmin profile to template context for authenticated school admins.
    This allows the base template to access profile data (name, photo, school).
    """
    context = {
        'school_admin_profile': None,
        'assigned_school': None,
    }
    
    if request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'SCHOOL_ADMIN':
        from .models import SchoolAdmin
        try:
            profile = SchoolAdmin.objects.select_related('school').get(user=request.user)
            context['school_admin_profile'] = profile
            context['assigned_school'] = profile.school
        except SchoolAdmin.DoesNotExist:
            pass
    
    return context
