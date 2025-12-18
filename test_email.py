# Quick email test script
# Run this with: python manage.py shell < test_email.py

from django.core.mail import send_mail
from django.conf import settings

print("\n" + "="*60)
print("TESTING EMAIL CONFIGURATION")
print("="*60)

try:
    send_mail(
        subject='Test Email from Enpower Skill Lab',
        message='This is a test email. If you receive this, your email configuration is working!',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=['test@example.com'],  # Replace with your test email
        fail_silently=False,
    )
    print("✅ Email sent successfully!")
    print(f"From: {settings.DEFAULT_FROM_EMAIL}")
    print(f"To: test@example.com")
    print("="*60 + "\n")
except Exception as e:
    print(f"❌ Email failed to send: {e}")
    print("="*60 + "\n")
