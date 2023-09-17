from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin
from pages.models import Page


class PageAdmin(SummernoteModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    summernote_fields = ('description',)


admin.site.register(Page, PageAdmin)
