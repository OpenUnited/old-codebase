from django.contrib import admin
from .models import ContributorGuide, ContributorAgreement, ContributorAgreementAcceptance

admin.site.register(ContributorGuide)
admin.site.register(ContributorAgreement)
admin.site.register(ContributorAgreementAcceptance)
