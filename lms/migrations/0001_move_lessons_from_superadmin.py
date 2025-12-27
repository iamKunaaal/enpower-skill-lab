# Custom migration to move Lesson models from superadmin to lms app
# Uses SeparateDatabaseAndState to preserve existing data

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
                    name='Lesson',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('title', models.CharField(help_text='Title of the lesson', max_length=255, verbose_name='Lesson Title')),
                        ('description', models.TextField(blank=True, help_text='Brief description of what students will learn', null=True, verbose_name='Short Description')),
                        ('thumbnail', models.ImageField(blank=True, help_text='Lesson thumbnail image (800x400 recommended)', null=True, upload_to='lessons/thumbnails/', verbose_name='Thumbnail')),
                        ('competency', models.CharField(blank=True, help_text='Competency this lesson belongs to', max_length=100, null=True, verbose_name='Competency')),
                        ('level', models.CharField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')], default='beginner', max_length=20, verbose_name='Difficulty Level')),
                        ('module', models.CharField(blank=True, max_length=100, null=True, verbose_name='Module / Category')),
                        ('applicable_grades', models.CharField(blank=True, help_text='Comma-separated grade levels (e.g., 8,9,10)', max_length=50, null=True, verbose_name='Applicable Grades')),
                        ('primary_content_type', models.CharField(choices=[('video', 'Video'), ('article', 'Article'), ('quiz', 'Quiz'), ('mixed', 'Mixed Content')], default='video', max_length=20, verbose_name='Primary Content Type')),
                        ('video_urls', models.TextField(blank=True, help_text='JSON array of video URLs (YouTube/Vimeo)', null=True, verbose_name='Video URLs')),
                        ('article_content', models.TextField(blank=True, help_text='Rich text content for article-type lessons', null=True, verbose_name='Article Content')),
                        ('quiz_data', models.TextField(blank=True, help_text='JSON data for quiz questions', null=True, verbose_name='Quiz Data')),
                        ('status', models.CharField(choices=[('draft', 'Draft'), ('published', 'Published'), ('archived', 'Archived')], default='draft', max_length=20, verbose_name='Status')),
                        ('is_published', models.BooleanField(default=False, help_text='Whether this lesson is publicly available', verbose_name='Published')),
                        ('recommend_low_competency', models.BooleanField(default=False, help_text='Suggest this lesson to students with low competency scores', verbose_name='Recommend for Low Competency')),
                        ('view_count', models.PositiveIntegerField(default=0, verbose_name='View Count')),
                        ('completion_count', models.PositiveIntegerField(default=0, verbose_name='Completion Count')),
                        ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                        ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated At')),
                        ('applicable_schools', models.ManyToManyField(blank=True, help_text='Schools where this lesson is available', related_name='lessons', to='schools.school', verbose_name='Applicable Schools')),
                        ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='lessons_created', to=settings.AUTH_USER_MODEL, verbose_name='Created By')),
                    ],
                    options={
                        'verbose_name': 'Lesson',
                        'verbose_name_plural': 'Lessons',
                        'db_table': 'lessons',
                        'ordering': ['-created_at'],
                    },
                ),
                migrations.CreateModel(
                    name='LessonResource',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('title', models.CharField(max_length=255, verbose_name='Resource Title')),
                        ('file', models.FileField(upload_to='lessons/resources/', verbose_name='File')),
                        ('resource_type', models.CharField(choices=[('pdf', 'PDF'), ('doc', 'Document'), ('ppt', 'Presentation'), ('xls', 'Spreadsheet'), ('other', 'Other')], default='other', max_length=20, verbose_name='Resource Type')),
                        ('file_size', models.PositiveIntegerField(default=0, verbose_name='File Size (bytes)')),
                        ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                        ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resources', to='lms.lesson', verbose_name='Lesson')),
                    ],
                    options={
                        'verbose_name': 'Lesson Resource',
                        'verbose_name_plural': 'Lesson Resources',
                        'db_table': 'lesson_resources',
                        'ordering': ['title'],
                    },
                ),
                migrations.CreateModel(
                    name='LessonVideo',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('title', models.CharField(blank=True, max_length=255, null=True, verbose_name='Video Title')),
                        ('source', models.CharField(choices=[('file', 'Uploaded File'), ('youtube', 'YouTube'), ('vimeo', 'Vimeo'), ('other', 'Other URL')], default='youtube', max_length=20, verbose_name='Source')),
                        ('url', models.URLField(blank=True, null=True, verbose_name='Video URL')),
                        ('file', models.FileField(blank=True, null=True, upload_to='lessons/videos/', verbose_name='Video File')),
                        ('duration', models.PositiveIntegerField(default=0, verbose_name='Duration (seconds)')),
                        ('order', models.PositiveIntegerField(default=0, verbose_name='Display Order')),
                        ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created At')),
                        ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='videos', to='lms.lesson', verbose_name='Lesson')),
                    ],
                    options={
                        'verbose_name': 'Lesson Video',
                        'verbose_name_plural': 'Lesson Videos',
                        'db_table': 'lesson_videos',
                        'ordering': ['order', 'created_at'],
                    },
                ),
            ],
            database_operations=[],
        ),
    ]
