from django.contrib import admin

# Register your models here.
from notification.models import EmailNotification


class EmailNotificationAdmin(admin.ModelAdmin):
    readonly_fields = ('permitted_params',)


admin.site.register(EmailNotification, EmailNotificationAdmin)
