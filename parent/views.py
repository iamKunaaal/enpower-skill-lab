from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from .models import Parent

# Create your views here.

@login_required
def parent_dashboard(request):
    """Parent dashboard view"""
    context = {
        # Add context data here as needed
    }
    return render(request, 'parent/dashboard.html', context)


@login_required
def parent_profile(request):
    """View for displaying parent profile"""
    try:
        parent = Parent.objects.get(user=request.user)
    except Parent.DoesNotExist:
        messages.error(request, 'Parent profile not found.')
        return redirect('parent_dashboard')

    context = {
        'parent': parent,
    }
    return render(request, 'parent/profile.html', context)


@login_required
def parent_profile_update(request):
    """View for updating parent profile"""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Invalid request method'})

    try:
        parent = Parent.objects.get(user=request.user)
    except Parent.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Parent profile not found'})

    try:
        # Update profile fields
        parent.full_name = request.POST.get('full_name', parent.full_name)
        parent.mobile_number = request.POST.get('mobile_number', parent.mobile_number)
        parent.alternate_mobile = request.POST.get('alternate_mobile', '') or None
        parent.relation_to_student = request.POST.get('relation_to_student', parent.relation_to_student)
        parent.occupation = request.POST.get('occupation', '') or None
        parent.organization = request.POST.get('organization', '') or None

        # Handle profile photo upload
        if 'profile_photo' in request.FILES:
            parent.profile_photo = request.FILES['profile_photo']

        parent.save()

        return JsonResponse({
            'success': True,
            'message': 'Profile updated successfully',
            'reload': True
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })
