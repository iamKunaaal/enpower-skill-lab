from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class SuperAdmin(models.Model):
    """
    Super Admin profile model to store additional information
    beyond the base User model
    """
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer-not-to-say', 'Prefer not to say'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='superadmin_profile'
    )
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_photo = models.ImageField(
        upload_to='superadmin/profile_photos/',
        blank=True,
        null=True
    )

    # Account metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)
    last_password_change = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'superadmin_profiles'
        verbose_name = 'Super Admin Profile'
        verbose_name_plural = 'Super Admin Profiles'

    def __str__(self):
        return f"{self.full_name} - Super Admin"
