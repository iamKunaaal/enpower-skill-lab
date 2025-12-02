from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages

# Create your views here.


def login_view(request):
    if request.method == "POST":
        role = request.POST.get("role")
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            if user.role != role:
                messages.error(request, "Invalid role for this account.")
                return redirect('login')

            login(request, user)

            # Redirect based on role
            if role == "SUPER_ADMIN":
                return redirect('/super-admin/dashboard/')
            if role == "PROGRAM_COORDINATOR":
                return redirect('/coordinator/dashboard/')
            if role == "SCHOOL_ADMIN":
                return redirect('/school-admin/dashboard/')
            if role == "THINKING_COACH":
                return redirect('/teacher/dashboard/')
            if role == "PARENT":
                return redirect('/parent/dashboard/')
            if role == "STUDENT":
                return redirect('/student/dashboard/')

        else:
            messages.error(request, "Invalid credentials")
            return redirect('login')

    return render(request, 'accounts/login.html')    