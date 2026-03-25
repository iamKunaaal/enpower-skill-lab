from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('competencies', '0007_update_project_types_and_assessment_fields'),
        ('student', '0001_move_student_from_superadmin'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ScoreEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.PositiveSmallIntegerField(blank=True, help_text='Score out of 10', null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('assessment_competency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scores', to='competencies.assessmentcompetency')),
                ('entered_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='score_entries', to='student.student')),
            ],
            options={
                'unique_together': {('student', 'assessment_competency')},
            },
        ),
    ]
