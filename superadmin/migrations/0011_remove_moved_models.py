# Custom migration to remove moved models from superadmin app
# Uses SeparateDatabaseAndState to preserve existing data

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('superadmin', '0010_remove_teacher_model'),
        ('student', '0001_move_student_from_superadmin'),
        ('parent', '0001_move_parent_from_superadmin'),
        ('lms', '0001_move_lessons_from_superadmin'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.DeleteModel(name='LessonVideo'),
                migrations.DeleteModel(name='LessonResource'),
                migrations.DeleteModel(name='Lesson'),
                migrations.DeleteModel(name='Parent'),
                migrations.DeleteModel(name='Student'),
            ],
            database_operations=[],
        ),
    ]
