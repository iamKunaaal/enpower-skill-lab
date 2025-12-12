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
    
    # Additional fields for all users
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        verbose_name="Phone Number",
        help_text="Contact phone number"
    )
    
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True,
        verbose_name="Profile Picture"
    )

    def __str__(self):
        return f"{self.username} ({self.role})"
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
