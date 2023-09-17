from django.contrib import admin
from talent.models import Person, ProductPerson, Review, PersonProfile


class PersonAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'first_name',
        'email_address',
        'photo',
        'github_username',
        'git_access_token',
        'slug'
    )


class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        'product',
        'person',
        'score',
        'text',
        'initiative',
        'created_by',
        'created_at',
        'updated_at'
    )
    fields = (
        'product',
        'person',
        'initiative',
        'score',
        'text',
        'created_by'
    )


class PersonProfileAdmin(admin.ModelAdmin):
    list_display = (
        'person',
    )


# Register your models here.
admin.site.register(Person, PersonAdmin)
admin.site.register(ProductPerson)
admin.site.register(Review, ReviewAdmin)
admin.site.register(PersonProfile, PersonProfileAdmin)
