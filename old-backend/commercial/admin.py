from django.contrib import admin
from commercial.models import Organisation, OrganisationPerson, Partner, ProductOwner

# Register your models here.
admin.site.register(Organisation)
admin.site.register(OrganisationPerson)
admin.site.register(Partner)
admin.site.register(ProductOwner)
