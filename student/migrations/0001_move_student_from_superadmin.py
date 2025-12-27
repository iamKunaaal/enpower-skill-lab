# Custom migration to move Student model from superadmin to student app
# Uses SeparateDatabaseAndState to preserve existing data

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('schools', '0003_class'),
        ('superadmin', '0010_remove_teacher_model'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.CreateModel(
                    name='Student',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('student_photo', models.ImageField(blank=True, null=True, upload_to='students/photos/')),
                        ('first_name', models.CharField(max_length=50)),
                        ('middle_name', models.CharField(blank=True, max_length=50, null=True)),
                        ('last_name', models.CharField(max_length=50)),
                        ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], max_length=10)),
                        ('date_of_birth', models.DateField()),
                        ('nationality', models.CharField(default='Indian', max_length=50)),
                        ('mother_tongue', models.CharField(blank=True, max_length=50, null=True)),
                        ('blood_group', models.CharField(blank=True, choices=[('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'), ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')], max_length=5, null=True)),
                        ('aadhar_number', models.CharField(blank=True, max_length=14, null=True)),
                        ('school_name', models.CharField(blank=True, max_length=200, null=True)),
                        ('school_branch', models.CharField(blank=True, max_length=100, null=True)),
                        ('student_class', models.CharField(max_length=10)),
                        ('division', models.CharField(max_length=10)),
                        ('roll_number', models.CharField(max_length=20)),
                        ('academic_year', models.CharField(max_length=20)),
                        ('gr_number', models.CharField(max_length=50, unique=True)),
                        ('previous_school', models.CharField(blank=True, max_length=200, null=True)),
                        ('stream', models.CharField(blank=True, choices=[('science', 'Science'), ('commerce', 'Commerce'), ('arts', 'Arts/Humanities'), ('na', 'Not Applicable')], max_length=20, null=True)),
                        ('school_board', models.CharField(choices=[('CBSE', 'CBSE'), ('ICSE', 'ICSE'), ('SSC', 'SSC (State Board)'), ('IB', 'IB (International Baccalaureate)'), ('IGCSE', 'IGCSE'), ('other', 'Other')], max_length=20)),
                        ('student_mobile', models.CharField(blank=True, max_length=15, null=True)),
                        ('school_email', models.EmailField(max_length=254, unique=True)),
                        ('personal_email', models.EmailField(blank=True, max_length=254, null=True)),
                        ('address', models.TextField(blank=True, null=True)),
                        ('skill_lab_reg_id', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                        ('enrollment_date', models.DateField()),
                        ('skills_enrolled', models.CharField(blank=True, max_length=200, null=True)),
                        ('current_skill_level', models.CharField(blank=True, choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')], max_length=20, null=True)),
                        ('assigned_trainer', models.CharField(blank=True, max_length=100, null=True)),
                        ('batch_timing', models.CharField(blank=True, max_length=100, null=True)),
                        ('learning_style', models.CharField(blank=True, choices=[('visual', 'Visual'), ('auditory', 'Auditory'), ('kinesthetic', 'Kinesthetic'), ('mixed', 'Mixed')], max_length=20, null=True)),
                        ('interests_aptitude', models.CharField(blank=True, max_length=200, null=True)),
                        ('preferred_language', models.CharField(blank=True, choices=[('english', 'English'), ('hindi', 'Hindi'), ('marathi', 'Marathi'), ('other', 'Other')], max_length=20, null=True)),
                        ('attendance_status', models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive'), ('on-leave', 'On Leave')], default='active', max_length=20)),
                        ('practice_hours', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                        ('certificates_earned', models.TextField(blank=True, null=True)),
                        ('badges_earned', models.TextField(blank=True, null=True)),
                        ('medical_conditions', models.TextField(blank=True, null=True)),
                        ('allergies', models.TextField(blank=True, null=True)),
                        ('emergency_instructions', models.TextField(blank=True, null=True)),
                        ('doctor_name', models.CharField(blank=True, max_length=100, null=True)),
                        ('doctor_contact', models.CharField(blank=True, max_length=15, null=True)),
                        ('physical_limitations', models.TextField(blank=True, null=True)),
                        ('emergency_name', models.CharField(max_length=100)),
                        ('emergency_relationship', models.CharField(choices=[('father', 'Father'), ('mother', 'Mother'), ('guardian', 'Guardian'), ('uncle', 'Uncle'), ('aunt', 'Aunt'), ('grandparent', 'Grandparent'), ('sibling', 'Sibling'), ('other', 'Other')], max_length=20)),
                        ('emergency_mobile', models.CharField(max_length=15)),
                        ('emergency_alt_mobile', models.CharField(blank=True, max_length=15, null=True)),
                        ('emergency_address', models.TextField(blank=True, null=True)),
                        ('sibling_1_name', models.CharField(blank=True, max_length=100, null=True)),
                        ('sibling_1_class_school', models.CharField(blank=True, max_length=100, null=True)),
                        ('sibling_1_skill_lab_id', models.CharField(blank=True, max_length=50, null=True)),
                        ('sibling_2_name', models.CharField(blank=True, max_length=100, null=True)),
                        ('sibling_2_class_school', models.CharField(blank=True, max_length=100, null=True)),
                        ('sibling_2_skill_lab_id', models.CharField(blank=True, max_length=50, null=True)),
                        ('sibling_3_name', models.CharField(blank=True, max_length=100, null=True)),
                        ('sibling_3_class_school', models.CharField(blank=True, max_length=100, null=True)),
                        ('sibling_3_skill_lab_id', models.CharField(blank=True, max_length=50, null=True)),
                        ('is_active', models.BooleanField(default=True)),
                        ('created_at', models.DateTimeField(auto_now_add=True)),
                        ('updated_at', models.DateTimeField(auto_now=True)),
                        ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='students_created', to=settings.AUTH_USER_MODEL)),
                        ('school', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='students', to='schools.school')),
                        ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='student_profile', to=settings.AUTH_USER_MODEL)),
                    ],
                    options={
                        'verbose_name': 'Student',
                        'verbose_name_plural': 'Students',
                        'db_table': 'students',
                        'ordering': ['-created_at'],
                    },
                ),
            ],
            database_operations=[],
        ),
    ]
