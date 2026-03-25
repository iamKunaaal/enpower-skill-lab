from django.contrib import admin
from .models import Pillar, SubPillar, Competency, Profile, Project, Assessment, AssessmentCompetency


@admin.register(Pillar)
class PillarAdmin(admin.ModelAdmin):
    list_display = ['number', 'name', 'color', 'order']
    ordering     = ['order']


@admin.register(SubPillar)
class SubPillarAdmin(admin.ModelAdmin):
    list_display  = ['sp_number', 'name', 'pillar']
    list_filter   = ['pillar']
    ordering      = ['sp_number']


@admin.register(Competency)
class CompetencyAdmin(admin.ModelAdmin):
    list_display  = ['code', 'name', 'stage', 'status', 'sub_pillar']
    list_filter   = ['stage', 'status', 'sub_pillar__pillar']
    search_fields = ['code', 'name']
    ordering      = ['sub_pillar__sp_number', 'code']


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display  = ['number', 'name']
    filter_horizontal = ['primary_competencies', 'secondary_competencies']
    ordering      = ['number']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'project_type', 'grade', 'status', 'created_at']
    list_filter  = ['project_type', 'grade', 'status']

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'assessment_type', 'project']
    list_filter  = ['assessment_type']
