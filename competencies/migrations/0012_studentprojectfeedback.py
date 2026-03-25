from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('competencies', '0011_add_sequence_number_and_project_report'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('student', '0001_move_student_from_superadmin'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentProjectFeedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feedback', models.TextField(blank=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('entered_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='student_feedbacks', to='competencies.project')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_feedbacks', to='student.student')),
            ],
            options={
                'unique_together': {('student', 'project')},
            },
        ),
    ]
