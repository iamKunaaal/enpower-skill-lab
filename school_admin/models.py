

from django.db import models
from django.conf import settings
from schools.models import School


class SchoolAdmin(models.Model):
    """
    School Administrator model linked to User account.
    Multiple admins can be assigned to one school.
    """

    # ==================== USER ACCOUNT LINK ====================
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='school_admin_profile',
        verbose_name="User Account",
        help_text="Linked user account for authentication"
    )

    # ==================== PERSONAL INFORMATION ====================
    full_name = models.CharField(
        max_length=200,
        verbose_name="Full Name",
        help_text="Complete name of the school administrator"
    )

    email = models.EmailField(
        unique=True,
        verbose_name="Email Address",
        help_text="Primary email for login and communication"
    )

    phone = models.CharField(
        max_length=10,
        verbose_name="Phone Number",
        help_text="10-digit mobile number"
    )

    profile_photo = models.ImageField(
        upload_to='school_admin_photos/',
        blank=True,
        null=True,
        verbose_name="Profile Photo",
        help_text="Profile picture (max 2MB)"
    )

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer-not-to-say', 'Prefer not to say'),
    ]

    gender = models.CharField(
        max_length=20,
        choices=GENDER_CHOICES,
        verbose_name="Gender"
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True,
        verbose_name="Date of Birth"
    )

    address = models.TextField(
        blank=True,
        null=True,
        verbose_name="Address",
        help_text="Complete residential address"
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="City"
    )

    state = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="State"
    )

    pincode = models.CharField(
        max_length=6,
        blank=True,
        null=True,
        verbose_name="PIN Code",
        help_text="6-digit PIN code"
    )

    # ==================== SCHOOL ASSIGNMENT ====================
    school = models.ForeignKey(
        School,
        on_delete=models.CASCADE,
        related_name='school_admins',
        verbose_name="Assigned School",
        help_text="School that this admin manages"
    )

    # ==================== ACCOUNT STATUS ====================
    STATUS_CHOICES = [
        ('pending', 'Pending - Awaiting First Login'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
    ]

    account_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Account Status"
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Is Active",
        help_text="Whether this admin account is active"
    )

    temporary_password = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        verbose_name="Temporary Password",
        help_text="Hashed temporary password for first login"
    )

    password_changed = models.BooleanField(
        default=False,
        verbose_name="Password Changed",
        help_text="Whether user has changed from temporary password"
    )

    last_password_change = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Last Password Change",
        help_text="Timestamp of last password change"
    )

    # ==================== TRACKING & METADATA ====================
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At"
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_school_admins',
        verbose_name="Created By",
        help_text="Super Admin who created this account"
    )

    first_login = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="First Login",
        help_text="Timestamp of first login"
    )

    last_login = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Last Login",
        help_text="Timestamp of most recent login"
    )

    # ==================== META & STRING REPRESENTATION ====================
    class Meta:
        verbose_name = "School Admin"
        verbose_name_plural = "School Admins"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['school']),
            models.Index(fields=['account_status']),
        ]

    def __str__(self):
        return f"{self.full_name} - {self.school.school_name}"

    # ==================== CUSTOM METHODS ====================
    def get_full_name(self):
        """Return the full name of the admin"""
        return self.full_name

    def is_pending(self):
        """Check if account is pending first login"""
        return self.account_status == 'pending'

    def activate_account(self):
        """Activate account after first login"""
        self.account_status = 'active'
        self.save()

    def mark_first_login(self):
        """Mark the first login timestamp"""
        if not self.first_login:
            from django.utils import timezone
            self.first_login = timezone.now()
            self.save()
