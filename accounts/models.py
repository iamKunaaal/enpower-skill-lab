from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('SUPER_ADMIN', 'Super Admin'),
        ('PROGRAM_COORDINATOR', 'Program Coordinator'),
        ('SCHOOL_ADMIN', 'School Admin'),
        ('THINKING_COACH', 'Thinking Coach'),
        ('PARENT', 'Parent'),
        ('STUDENT', 'Student'),
    ]

    role = models.CharField(max_length=30, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"
