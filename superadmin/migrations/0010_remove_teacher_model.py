# Custom migration to remove Teacher model from superadmin app
# Uses SeparateDatabaseAndState to preserve existing data in 'teachers' table

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('superadmin', '0009_add_teacher_last_password_change'),
        ('teacher', '0001_move_teacher_from_superadmin'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.DeleteModel(
                    name='Teacher',
                ),
            ],
            database_operations=[],
        ),
    ]
