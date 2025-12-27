# Custom migration to move Parent model from superadmin to parent app
# Uses SeparateDatabaseAndState to preserve existing data

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('student', '0001_move_student_from_superadmin'),
        ('superadmin', '0010_remove_teacher_model'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.CreateModel(
                    name='Parent',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('parent_id', models.CharField(blank=True, max_length=20, unique=True)),
                        ('profile_photo', models.ImageField(blank=True, null=True, upload_to='parents/photos/')),
                        ('full_name', models.CharField(max_length=200)),
                        ('relation_to_student', models.CharField(choices=[('mother', 'Mother'), ('father', 'Father'), ('guardian', 'Guardian')], max_length=20)),
                        ('mobile_number', models.CharField(max_length=15)),
                        ('alternate_mobile', models.CharField(blank=True, max_length=15, null=True)),
                        ('email', models.EmailField(max_length=254, unique=True)),
                        ('occupation', models.CharField(blank=True, max_length=100, null=True)),
                        ('organization', models.CharField(blank=True, max_length=200, null=True)),
                        ('education_level', models.CharField(blank=True, choices=[('high-school', 'High School'), ('diploma', 'Diploma'), ('graduate', 'Graduate'), ('post-graduate', 'Post Graduate'), ('doctorate', 'Doctorate'), ('other', 'Other')], max_length=20, null=True)),
                        ('id_proof', models.CharField(blank=True, max_length=20, null=True)),
                        ('secondary_full_name', models.CharField(blank=True, max_length=200, null=True)),
                        ('secondary_relation', models.CharField(blank=True, choices=[('mother', 'Mother'), ('father', 'Father'), ('guardian', 'Guardian'), ('grandparent', 'Grandparent'), ('uncle', 'Uncle'), ('aunt', 'Aunt')], max_length=20, null=True)),
                        ('secondary_mobile', models.CharField(blank=True, max_length=15, null=True)),
                        ('secondary_email', models.EmailField(blank=True, max_length=254, null=True)),
                        ('secondary_occupation', models.CharField(blank=True, max_length=100, null=True)),
                        ('preferred_contact', models.CharField(choices=[('primary', 'Primary Parent/Guardian'), ('secondary', 'Secondary Parent/Guardian'), ('both', 'Both')], default='primary', max_length=20)),
                        ('residential_address', models.TextField()),
                        ('landmark', models.CharField(blank=True, max_length=200, null=True)),
                        ('city', models.CharField(max_length=100)),
                        ('state', models.CharField(max_length=100)),
                        ('pin_code', models.CharField(max_length=6)),
                        ('permanent_address', models.TextField(blank=True, null=True)),
                        ('contact_method', models.CharField(choices=[('call', 'Phone Call'), ('whatsapp', 'WhatsApp'), ('sms', 'SMS'), ('email', 'Email')], default='whatsapp', max_length=20)),
                        ('preferred_language', models.CharField(choices=[('english', 'English'), ('hindi', 'Hindi'), ('marathi', 'Marathi'), ('gujarati', 'Gujarati'), ('tamil', 'Tamil'), ('telugu', 'Telugu'), ('kannada', 'Kannada'), ('other', 'Other')], default='english', max_length=20)),
                        ('dnd_timings', models.CharField(blank=True, max_length=100, null=True)),
                        ('whatsapp_consent', models.BooleanField(default=True)),
                        ('photo_consent', models.BooleanField(default=True)),
                        ('fee_category', models.CharField(choices=[('regular', 'Regular'), ('scholarship', 'Scholarship'), ('concession', 'Concession')], default='regular', max_length=20)),
                        ('payment_mode', models.CharField(blank=True, choices=[('online', 'Online Payment'), ('bank-transfer', 'Bank Transfer'), ('cheque', 'Cheque'), ('cash', 'Cash'), ('upi', 'UPI')], max_length=20, null=True)),
                        ('billing_email', models.EmailField(blank=True, max_length=254, null=True)),
                        ('gst_number', models.CharField(blank=True, max_length=20, null=True)),
                        ('emergency_name', models.CharField(max_length=100)),
                        ('emergency_relation', models.CharField(choices=[('grandparent', 'Grandparent'), ('uncle', 'Uncle'), ('aunt', 'Aunt'), ('sibling', 'Sibling'), ('neighbor', 'Neighbor'), ('family-friend', 'Family Friend'), ('other', 'Other')], max_length=20)),
                        ('emergency_phone', models.CharField(max_length=15)),
                        ('emergency_address', models.TextField(blank=True, null=True)),
                        ('meeting_availability', models.CharField(blank=True, choices=[('online', 'Online Only'), ('offline', 'Offline Only'), ('both', 'Both Online and Offline'), ('not-available', 'Not Available')], max_length=20, null=True)),
                        ('volunteer_interest', models.CharField(blank=True, max_length=10, null=True)),
                        ('parent_skills', models.TextField(blank=True, null=True)),
                        ('account_status', models.CharField(choices=[('active', 'Active'), ('pending', 'Pending'), ('inactive', 'Inactive')], default='pending', max_length=20)),
                        ('is_active', models.BooleanField(default=True)),
                        ('created_at', models.DateTimeField(auto_now_add=True)),
                        ('updated_at', models.DateTimeField(auto_now=True)),
                        ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='parents_created', to=settings.AUTH_USER_MODEL)),
                        ('students', models.ManyToManyField(blank=True, related_name='parents', to='student.student')),
                        ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='parent_profile', to=settings.AUTH_USER_MODEL)),
                    ],
                    options={
                        'verbose_name': 'Parent',
                        'verbose_name_plural': 'Parents',
                        'db_table': 'parents',
                        'ordering': ['-created_at'],
                    },
                ),
            ],
            database_operations=[],
        ),
    ]
