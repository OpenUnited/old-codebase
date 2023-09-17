from .mutations import *
from talent.models import ProductPerson
from api.utils import logged_in_user


class OrganisationQuery(ObjectType):
    organisations = graphene.List(OrganisationType)
    organisation = graphene.Field(OrganisationType, id=graphene.Int())

    def resolve_match(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Organisation.objects.get(pk=id)

        return None

    def resolve_matches(self, info, query=None, **kwargs):
        qs = Organisation.objects.all()
        return qs


class PartnerQuery(ObjectType):
    partners = graphene.List(PartnerType, product_slug=graphene.String())
    partner = graphene.Field(PartnerType, id=graphene.Int())

    def resolve_partner(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return Partner.objects.get(pk=id)

        return None

    def resolve_partners(self, info, query=None, **kwargs):
        product_slug = kwargs.get('product_slug')
        if product_slug:
            qs = Partner.objects.filter(product__slug=product_slug)
            return qs

        current_user = logged_in_user()
        product_ids = ProductPerson.objects.filter(person=current_user) \
                                         .values_list("product", flat=True)
        qs = Partner.objects.filter(product__id__in=product_ids)
        return qs


class OrganisationPersonQuery(ObjectType):
    organisation_persons = graphene.List(OrganisationPersonType)
    organisation_person = graphene.Field(OrganisationPersonType, id=graphene.Int())

    def resolve_person(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return OrganisationPerson.objects.get(pk=id)

        return None

    def resolve_persons(self, info, query=None, **kwargs):
        qs = OrganisationPerson.objects.all()
        return qs


class CommercialMutations(graphene.ObjectType):
    create_organisation = CreateOrganisationMutation.Field()
    update_organisation = UpdateOrganisationMutation.Field()
    delete_organisation = DeleteOrganisationMutation.Field()
    create_partner = CreatePartnerMutation.Field()
    update_partner = UpdatePartnerMutation.Field()
    delete_partner = DeletePartnerMutation.Field()
    create_organisation_person = CreateOrganisationPersonMutation.Field()
    update_organisation_person = UpdateOrganisationPersonMutation.Field()
    delete_organisation_person = DeleteOrganisationPersonMutation.Field()
