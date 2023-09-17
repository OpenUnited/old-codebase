from django.contrib import admin
from ideas_bugs.models import Idea, Bug

admin.site.register(Bug)
admin.site.register(Idea)
