from django.conf import settings
from django.db import models


STAGE_CHOICES = [
    ('Foundational', 'Foundational — Class 1–2'),
    ('Preparatory',  'Preparatory — Class 3–5'),
    ('Middle',       'Middle — Class 6–8'),
    ('Secondary',    'Secondary — Class 9–12'),
]

STATUS_CHOICES = [
    ('Active', 'Active'),
    ('Draft',  'Draft'),
]

PILLAR_COLOR_CHOICES = [
    ('teal',   'Teal'),
    ('purple', 'Purple'),
    ('blue',   'Blue'),
    ('orange', 'Orange'),
    ('green',  'Green'),
]


class Pillar(models.Model):
    """5 main learning pillars of the neoRiSE framework."""
    name   = models.CharField(max_length=100)
    number = models.CharField(max_length=2)   # '01', '02' ...
    color  = models.CharField(max_length=20, choices=PILLAR_COLOR_CHOICES)
    order  = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.number}. {self.name}"


class SubPillar(models.Model):
    """17 sub-pillars (SP1–SP17), each under a Pillar."""
    pillar    = models.ForeignKey(Pillar, on_delete=models.CASCADE, related_name='sub_pillars')
    sp_number = models.PositiveSmallIntegerField(unique=True)   # 1–17
    name      = models.CharField(max_length=150)

    class Meta:
        ordering = ['sp_number']

    def __str__(self):
        return f"SP{self.sp_number}: {self.name}"

    @property
    def code(self):
        return f"SP{self.sp_number}"


class Competency(models.Model):
    """Individual competency under a SubPillar."""
    sub_pillar  = models.ForeignKey(SubPillar, on_delete=models.CASCADE, related_name='competencies')
    code        = models.CharField(max_length=20, unique=True)   # e.g. SP1.C3
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    stage       = models.CharField(max_length=20, choices=STAGE_CHOICES)
    status      = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['sub_pillar__sp_number', 'code']
        verbose_name_plural = 'Competencies'

    def __str__(self):
        return f"{self.code} — {self.name}"


class Profile(models.Model):
    """15 student skill profiles of the neoRiSE Skill Passport."""
    number = models.PositiveSmallIntegerField(unique=True)   # 1–15
    name   = models.CharField(max_length=100)
    primary_competencies   = models.ManyToManyField(
        Competency, related_name='primary_profiles',   blank=True)
    secondary_competencies = models.ManyToManyField(
        Competency, related_name='secondary_profiles', blank=True)

    class Meta:
        ordering = ['number']

    def __str__(self):
        return f"{self.number}. {self.name}"


PROJECT_TYPE_CHOICES = [
    ('Life Form',          'Life Form'),
    ('Machines & Materials', 'Machines & Materials'),
    ('Human Services',     'Human Services'),
    ('Plug In',            'Plug In'),
    ('Final Project',      'Final Project'),
]

ASSESSMENT_TYPE_CHOICES = [
    ('Written Assignment', 'Written Assignment'),
    ('Presentation',       'Presentation'),
    ('Peer Review',        'Peer Review'),
    ('Lab Report',         'Lab Report'),
]


class Project(models.Model):
    title           = models.CharField(max_length=200)
    project_type    = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES, default='Capstone')
    grade           = models.CharField(max_length=20, choices=STAGE_CHOICES)
    status          = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Draft')
    sequence_number = models.PositiveSmallIntegerField(
        null=True, blank=True,
        help_text='Order of this project in the year (1, 2, 3, 4). Used for Annual Passport — latest score wins.'
    )
    linked_project  = models.ForeignKey(
        'self', on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='plugins',
        help_text='Only for Plug-In type: select the Project this Plug-In belongs to'
    )
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Assessment(models.Model):
    project                  = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='assessments')
    name                     = models.CharField(max_length=200)
    assessment_type          = models.CharField(max_length=30, choices=ASSESSMENT_TYPE_CHOICES, default='Written Assignment')
    placement_after_challenge = models.PositiveSmallIntegerField(blank=True, null=True, help_text='After Challenge #')
    output_descriptor        = models.TextField(blank=True)
    additional_instructions  = models.TextField(blank=True, help_text='Additional instructions for the teacher')
    rubric_file              = models.FileField(upload_to='rubrics/', blank=True, null=True)
    order                    = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.project.title} — {self.name}"


class AssessmentCompetency(models.Model):
    COMP_TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('group',      'Group'),
    ]
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='competency_mappings')
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE, related_name='assessment_mappings')
    comp_type  = models.CharField(max_length=10, choices=COMP_TYPE_CHOICES, default='individual')
    order      = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        unique_together = [('assessment', 'competency')]


class StudentAssessmentFeedback(models.Model):
    student    = models.ForeignKey('student.Student', on_delete=models.CASCADE, related_name='assessment_feedbacks')
    assessment = models.ForeignKey('Assessment', on_delete=models.CASCADE, related_name='student_feedbacks')
    feedback   = models.TextField(blank=True)
    entered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [('student', 'assessment')]

    def __str__(self):
        return f"{self.student} — {self.assessment} — feedback"


class StudentProjectFeedback(models.Model):
    student    = models.ForeignKey('student.Student', on_delete=models.CASCADE, related_name='project_feedbacks')
    project    = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='student_feedbacks')
    feedback   = models.TextField(blank=True)
    entered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [('student', 'project')]

    def __str__(self):
        return f"{self.student} — {self.project} — overall feedback"


class ScoreEntry(models.Model):
    student               = models.ForeignKey('student.Student', on_delete=models.CASCADE, related_name='score_entries')
    assessment_competency = models.ForeignKey(AssessmentCompetency, on_delete=models.CASCADE, related_name='scores')
    score                 = models.PositiveSmallIntegerField(null=True, blank=True, help_text='Score 1–10')
    entered_by            = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at            = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [('student', 'assessment_competency')]

    def __str__(self):
        return f"{self.student} — {self.assessment_competency} — {self.score}"


class ProjectReport(models.Model):
    student               = models.ForeignKey('student.Student', on_delete=models.CASCADE, related_name='project_reports')
    project               = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='reports')
    top_3_profiles        = models.JSONField(default=list)
    top_5_competencies    = models.JSONField(default=list)
    skills_to_work_on     = models.JSONField(default=list)
    all_competency_scores = models.JSONField(default=dict)
    generated_at          = models.DateTimeField(auto_now=True)
    is_outdated           = models.BooleanField(default=False)

    class Meta:
        unique_together = [('student', 'project')]

    def __str__(self):
        return f"{self.student} — {self.project} — Report"
