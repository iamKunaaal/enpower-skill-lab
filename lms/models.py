from django.db import models
from django.conf import settings
from schools.models import School


class Lesson(models.Model):
    """
    Lesson model for competency-based self-learning content.
    Lessons can contain videos, articles, quizzes, and resources.
    """
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    CONTENT_TYPE_CHOICES = [
        ('video', 'Video'),
        ('article', 'Article'),
        ('quiz', 'Quiz'),
        ('mixed', 'Mixed Content'),
    ]
    
    # Basic Information
    title = models.CharField(
        max_length=255,
        verbose_name="Lesson Title",
        help_text="Title of the lesson"
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name="Short Description",
        help_text="Brief description of what students will learn"
    )
    
    thumbnail = models.ImageField(
        upload_to='lessons/thumbnails/',
        blank=True,
        null=True,
        verbose_name="Thumbnail",
        help_text="Lesson thumbnail image (800x400 recommended)"
    )
    
    # Assignment
    competency = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Competency",
        help_text="Competency this lesson belongs to"
    )
    
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default='beginner',
        verbose_name="Difficulty Level"
    )
    
    module = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Module / Category"
    )
    
    # Lesson Context
    applicable_schools = models.ManyToManyField(
        School,
        blank=True,
        related_name='lessons',
        verbose_name="Applicable Schools",
        help_text="Schools where this lesson is available"
    )
    
    applicable_grades = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="Applicable Grades",
        help_text="Comma-separated grade levels (e.g., 8,9,10)"
    )
    
    # Content
    primary_content_type = models.CharField(
        max_length=20,
        choices=CONTENT_TYPE_CHOICES,
        default='video',
        verbose_name="Primary Content Type"
    )
    
    video_urls = models.TextField(
        blank=True,
        null=True,
        verbose_name="Video URLs",
        help_text="JSON array of video URLs (YouTube/Vimeo)"
    )
    
    article_content = models.TextField(
        blank=True,
        null=True,
        verbose_name="Article Content",
        help_text="Rich text content for article-type lessons"
    )
    
    quiz_data = models.TextField(
        blank=True,
        null=True,
        verbose_name="Quiz Data",
        help_text="JSON data for quiz questions"
    )
    
    # Visibility & Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name="Status"
    )
    
    is_published = models.BooleanField(
        default=False,
        verbose_name="Published",
        help_text="Whether this lesson is publicly available"
    )
    
    recommend_low_competency = models.BooleanField(
        default=False,
        verbose_name="Recommend for Low Competency",
        help_text="Suggest this lesson to students with low competency scores"
    )
    
    # Metrics
    view_count = models.PositiveIntegerField(
        default=0,
        verbose_name="View Count"
    )
    
    completion_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Completion Count"
    )
    
    # Metadata
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
        related_name='lessons_created',
        verbose_name="Created By"
    )
    
    class Meta:
        db_table = 'lessons'
        verbose_name = 'Lesson'
        verbose_name_plural = 'Lessons'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_level_display()})"
    
    @property
    def completion_rate(self):
        """Calculate completion rate as percentage"""
        if self.view_count == 0:
            return 0
        return round((self.completion_count / self.view_count) * 100, 1)


class LessonResource(models.Model):
    """
    Resources attached to a lesson (PDFs, documents, etc.)
    """
    RESOURCE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('doc', 'Document'),
        ('ppt', 'Presentation'),
        ('xls', 'Spreadsheet'),
        ('other', 'Other'),
    ]
    
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='resources',
        verbose_name="Lesson"
    )
    
    title = models.CharField(
        max_length=255,
        verbose_name="Resource Title"
    )
    
    file = models.FileField(
        upload_to='lessons/resources/',
        verbose_name="File"
    )
    
    resource_type = models.CharField(
        max_length=20,
        choices=RESOURCE_TYPE_CHOICES,
        default='other',
        verbose_name="Resource Type"
    )
    
    file_size = models.PositiveIntegerField(
        default=0,
        verbose_name="File Size (bytes)"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )
    
    class Meta:
        db_table = 'lesson_resources'
        verbose_name = 'Lesson Resource'
        verbose_name_plural = 'Lesson Resources'
        ordering = ['title']
    
    def __str__(self):
        return f"{self.title} - {self.lesson.title}"


class LessonVideo(models.Model):
    """
    Videos attached to a lesson
    """
    SOURCE_CHOICES = [
        ('file', 'Uploaded File'),
        ('youtube', 'YouTube'),
        ('vimeo', 'Vimeo'),
        ('other', 'Other URL'),
    ]
    
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='videos',
        verbose_name="Lesson"
    )
    
    title = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Video Title"
    )
    
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default='youtube',
        verbose_name="Source"
    )
    
    url = models.URLField(
        blank=True,
        null=True,
        verbose_name="Video URL"
    )
    
    file = models.FileField(
        upload_to='lessons/videos/',
        blank=True,
        null=True,
        verbose_name="Video File"
    )
    
    duration = models.PositiveIntegerField(
        default=0,
        verbose_name="Duration (seconds)"
    )
    
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )
    
    class Meta:
        db_table = 'lesson_videos'
        verbose_name = 'Lesson Video'
        verbose_name_plural = 'Lesson Videos'
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.title or 'Video'} - {self.lesson.title}"
