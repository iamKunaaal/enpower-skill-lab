from django.contrib import admin
from lms.models import Lesson, LessonResource, LessonVideo


class LessonResourceInline(admin.TabularInline):
    model = LessonResource
    extra = 0
    fields = ('title', 'file', 'resource_type', 'file_size')
    readonly_fields = ('file_size',)


class LessonVideoInline(admin.TabularInline):
    model = LessonVideo
    extra = 0
    fields = ('title', 'source', 'url', 'file', 'duration', 'order')


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'competency', 'level', 'status', 'is_published', 'view_count', 'completion_count', 'created_at')
    list_filter = ('status', 'level', 'is_published', 'primary_content_type', 'recommend_low_competency', 'created_at')
    search_fields = ('title', 'description', 'competency', 'module')
    readonly_fields = ('view_count', 'completion_count', 'created_at', 'updated_at', 'created_by')
    filter_horizontal = ('applicable_schools',)
    inlines = [LessonVideoInline, LessonResourceInline]
    ordering = ['-created_at']

    actions = ['publish_lessons', 'unpublish_lessons', 'archive_lessons']

    def publish_lessons(self, request, queryset):
        updated = queryset.update(status='published', is_published=True)
        self.message_user(request, f'{updated} lesson(s) published.')
    publish_lessons.short_description = "Publish selected lessons"

    def unpublish_lessons(self, request, queryset):
        updated = queryset.update(status='draft', is_published=False)
        self.message_user(request, f'{updated} lesson(s) unpublished.')
    unpublish_lessons.short_description = "Unpublish selected lessons"

    def archive_lessons(self, request, queryset):
        updated = queryset.update(status='archived', is_published=False)
        self.message_user(request, f'{updated} lesson(s) archived.')
    archive_lessons.short_description = "Archive selected lessons"


@admin.register(LessonResource)
class LessonResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'resource_type', 'file_size', 'created_at')
    list_filter = ('resource_type', 'created_at')
    search_fields = ('title', 'lesson__title')
    readonly_fields = ('created_at',)


@admin.register(LessonVideo)
class LessonVideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'source', 'duration', 'order', 'created_at')
    list_filter = ('source', 'created_at')
    search_fields = ('title', 'lesson__title', 'url')
    readonly_fields = ('created_at',)
