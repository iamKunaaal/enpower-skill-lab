from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def parent_dashboard(request):
    """Parent dashboard view"""
    context = {
        # Add context data here as needed
    }
    return render(request, 'parent/dashboard.html', context)
