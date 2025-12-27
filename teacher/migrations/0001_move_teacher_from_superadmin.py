# Custom migration to move Teacher model from superadmin to teacher app
# Uses SeparateDatabaseAndState to preserve existing data in 'teachers' table

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('schools', '0003_class'),
        ('superadmin', '0009_add_teacher_last_password_change'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.CreateModel(
                    name='Teacher',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('profile_photo', models.ImageField(blank=True, null=True, upload_to='teachers/photos/')),
                        ('employee_id', models.CharField(max_length=50, unique=True)),
                        ('full_name', models.CharField(max_length=200)),
                        ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], max_length=10)),
                        ('date_of_birth', models.DateField()),
                        ('blood_group', models.CharField(blank=True, choices=[('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')], max_length=5, null=True)),
                        ('nationality', models.CharField(default='Indian', max_length=50)),
                        ('aadhar_number', models.CharField(blank=True, max_length=14, null=True)),
                        ('pan_number', models.CharField(blank=True, max_length=10, null=True)),
                        ('designation', models.CharField(choices=[('enpower-trainer', 'ENpower Trainer'), ('school-teacher', 'School Teacher'), ('head-teacher', 'Head Teacher'), ('assistant-teacher', 'Assistant Teacher'), ('principal', 'Principal'), ('coordinator', 'Program Coordinator')], max_length=50)),
                        ('qualification', models.CharField(max_length=200)),
                        ('specialization', models.CharField(blank=True, max_length=200, null=True)),
                        ('total_experience', models.CharField(max_length=100)),
                        ('skill_training_experience', models.CharField(blank=True, max_length=100, null=True)),
                        ('previous_organizations', models.TextField(blank=True, null=True)),
                        ('certifications', models.TextField(blank=True, null=True)),
                        ('languages_known', models.CharField(blank=True, max_length=200, null=True)),
                        ('grades_taught', models.CharField(blank=True, max_length=100, null=True)),
                        ('training_style', models.CharField(blank=True, choices=[('interactive', 'Interactive'), ('conceptual', 'Conceptual'), ('activity-based', 'Activity-Based'), ('mixed', 'Mixed Approach')], max_length=20, null=True)),
                        ('mobile_number', models.CharField(max_length=15)),
                        ('alternate_number', models.CharField(blank=True, max_length=15, null=True)),
                        ('official_email', models.EmailField(max_length=254, unique=True)),
                        ('personal_email', models.EmailField(blank=True, max_length=254, null=True)),
                        ('current_address', models.TextField()),
                        ('permanent_address', models.TextField(blank=True, null=True)),
                        ('city', models.CharField(max_length=100)),
                        ('state', models.CharField(max_length=100)),
                        ('pin_code', models.CharField(max_length=6)),
                        ('skill_lab_center', models.CharField(blank=True, max_length=200, null=True)),
                        ('branch_location', models.CharField(blank=True, max_length=200, null=True)),
                        ('batch_timings', models.CharField(blank=True, max_length=100, null=True)),
                        ('weekly_timetable', models.CharField(blank=True, max_length=200, null=True)),
                        ('student_groups', models.CharField(blank=True, max_length=200, null=True)),
                        ('modules_assigned', models.TextField(blank=True, null=True)),
                        ('active_classes', models.CharField(blank=True, max_length=200, null=True)),
                        ('total_students', models.IntegerField(blank=True, default=0, null=True)),
                        ('dashboard_role', models.CharField(blank=True, choices=[('coach', 'Thinking Coach'), ('senior-coach', 'Senior Coach'), ('coordinator', 'Program Coordinator'), ('admin', 'Admin')], max_length=20, null=True)),
                        ('joining_date', models.DateField()),
                        ('contract_end_date', models.DateField(blank=True, null=True)),
                        ('employment_type', models.CharField(choices=[('full-time', 'Full-time'), ('part-time', 'Part-time'), ('visiting', 'Visiting'), ('contract', 'Contract')], max_length=20)),
                        ('emergency_contact_name', models.CharField(max_length=100)),
                        ('emergency_relation', models.CharField(choices=[('spouse', 'Spouse'), ('parent', 'Parent'), ('sibling', 'Sibling'), ('child', 'Child'), ('friend', 'Friend'), ('other', 'Other')], max_length=20)),
                        ('emergency_mobile', models.CharField(max_length=15)),
                        ('emergency_secondary', models.CharField(blank=True, max_length=15, null=True)),
                        ('health_notes', models.TextField(blank=True, null=True)),
                        ('id_proof_submitted', models.CharField(blank=True, max_length=20, null=True)),
                        ('address_proof_submitted', models.CharField(blank=True, choices=[('yes', 'Yes'), ('no', 'No'), ('pending', 'Pending')], max_length=20, null=True)),
                        ('police_verification', models.CharField(blank=True, max_length=20, null=True)),
                        ('contract_uploaded', models.CharField(blank=True, choices=[('yes', 'Yes'), ('no', 'No'), ('pending', 'Pending')], max_length=20, null=True)),
                        ('passport_photo', models.ImageField(blank=True, null=True, upload_to='teachers/passport_photos/')),
                        ('pan_aadhar_linked', models.CharField(blank=True, max_length=20, null=True)),
                        ('resume', models.FileField(blank=True, null=True, upload_to='teachers/resumes/')),
                        ('bank_details_submitted', models.CharField(blank=True, choices=[('yes', 'Yes'), ('no', 'No'), ('pending', 'Pending')], max_length=20, null=True)),
                        ('ifsc_code', models.CharField(blank=True, max_length=11, null=True)),
                        ('bank_account_number', models.CharField(blank=True, max_length=20, null=True)),
                        ('bank_name', models.CharField(blank=True, max_length=100, null=True)),
                        ('branch_name', models.CharField(blank=True, max_length=100, null=True)),
                        ('passbook_copy', models.FileField(blank=True, null=True, upload_to='teachers/passbooks/')),
                        ('hobbies', models.CharField(blank=True, max_length=200, null=True)),
                        ('strength_areas', models.CharField(blank=True, max_length=200, null=True)),
                        ('improvement_areas', models.CharField(blank=True, max_length=200, null=True)),
                        ('training_resources', models.CharField(blank=True, max_length=200, null=True)),
                        ('achievements', models.TextField(blank=True, null=True)),
                        ('attendance_status', models.CharField(choices=[('present', 'Present'), ('absent', 'Absent'), ('on-leave', 'On Leave')], default='present', max_length=20)),
                        ('is_active', models.BooleanField(default=True)),
                        ('created_at', models.DateTimeField(auto_now_add=True)),
                        ('updated_at', models.DateTimeField(auto_now=True)),
                        ('last_password_change', models.DateTimeField(blank=True, null=True)),
                        ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='teachers_created', to=settings.AUTH_USER_MODEL)),
                        ('school', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='teachers', to='schools.school')),
                        ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='teacher_profile', to=settings.AUTH_USER_MODEL)),
                    ],
                    options={
                        'verbose_name': 'Teacher',
                        'verbose_name_plural': 'Teachers',
                        'db_table': 'teachers',
                        'ordering': ['-created_at'],
                    },
                ),
            ],
            database_operations=[],
        ),
    ]
