from django.contrib import admin
from matching.models import BountyClaim


class BountyClaimAdmin(admin.ModelAdmin):
    list_display = (
        'bounty',
        'person',
        'kind',
        'created_at',
    )


# Register your models here.
admin.site.register(BountyClaim, BountyClaimAdmin)
