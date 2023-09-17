from .types import *
from commercial.models import *
from work.models import Product


class CreateOrganisationMutation(graphene.Mutation):
    class Arguments:
        input = OrganisationInput(
            required=True,
            description=("Fields required to create a organisation"),
        )

    organisation = graphene.Field(OrganisationType)

    def mutate(cls, instance, input=None):
        organisation = Organisation(name=input.name)
        organisation.save()
        return CreateOrganisationMutation(organisation=organisation)


class UpdateOrganisationMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = OrganisationInput(required=True)

    status = graphene.Boolean()
    organisation = graphene.Field(OrganisationType)

    @staticmethod
    def mutate(root, info, id, input=None):
        status = False
        try:
            status = True
            organisation = Organisation.objects.get(pk=id)
            organisation.name = input.name
            organisation.save()
            return UpdateOrganisationMutation(status=status, organisation=organisation)
        except Exception as e:
            pass
        return UpdateOrganisationMutation(status=status, product=None)


class DeleteOrganisationMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    status = graphene.Boolean()
    organisation_id = graphene.Int()

    @staticmethod
    def mutate(root, info, id, input=None):
        status = False
        try:
            Organisation.objects.get(pk=id).delete()
            status = True
            return DeleteOrganisationMutation(status=status, organisation_id=id)
        except:
            pass
        return DeleteOrganisationMutation(status=status)


class CreatePartnerMutation(graphene.Mutation):
    class Arguments:
        input = PartnerInput(
            required=True,
            description=("Fields required to create a product")
        )

    partner = graphene.Field(PartnerType)
    status = graphene.Boolean()

    @staticmethod
    def mutate(cls, instance, input=None):
        status = False
        partner = None
        try:
            product = Product.objects.get(id=input.product)
            organisation = Organisation.objects.get(id=input.organisation)
            partner = Partner(product=product, organisation=organisation, kind=input.kind)
            partner.save()
            status = True
        except:
            pass
        return CreatePartnerMutation(partner=partner, status=status)


class UpdatePartnerMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = PartnerInput(
            required=True,
            description=("Fields required to create a product"),
        )

    partner = graphene.Field(PartnerType)
    status = graphene.Boolean()

    @staticmethod
    def mutate(cls, instance, input=None):
        status = False
        partner = None
        try:
            partner = Partner.objects.get(pk=input.id)
            product = Product.objects.get(id=input.product)
            organisation = Organisation.objects.get(id=input.organisation)

            partner.product = product
            partner.organisation = organisation
            partner.kind = input.kind
            partner.save()
        except:
            pass
        return UpdatePartnerMutation(partner=partner, status=status)


class DeletePartnerMutation(graphene.Mutation):
    class Arguments:
        input = PartnerInput(
            required=True,
            description=("Fields required to create a product"),
        )

    partner_id = graphene.Int()
    status = graphene.Boolean()

    @staticmethod
    def mutate(cls, instance, input=None):
        status = False
        partner_id = None
        try:
            Partner.objects.get(pk=id).delete()
            status = True
        except:
            pass
        return DeletePartnerMutation(partner_id=partner_id, status=status)


class CreateOrganisationPersonMutation(graphene.Mutation):
    class Arguments:
        input = OrganisationPersonInput(
            required=True,
            description=("Fields required to create a product"),
        )

    organisation_person = graphene.Field(OrganisationPersonType)
    status = graphene.Boolean()

    @staticmethod
    def mutate(cls, instance, input=None):
        status = False
        organisation_person = None
        try:
            person = Person.objects.get(id=input.person)
            organisation = Organisation.objects.get(id=input.organisation)
            organisation_person = OrganisationPerson(person=person,
                                    organisation=organisation,
                                    right=input.right)
            organisation_person.save()
            status = True
        except:
            pass
        return CreateOrganisationPersonMutation(organisation_person=organisation_person, status=status)


class UpdateOrganisationPersonMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = OrganisationPersonInput(
            required=True,
            description=("Fields required to create a product"),
        )

    partner = graphene.Field(OrganisationPersonType)
    status = graphene.Boolean()

    @staticmethod
    def mutate(cls, instance, input=None):
        status = False
        partner = None
        try:
            organisation_person = OrganisationPerson.objects.get(pk=input.id)
            person = Person.objects.get(id=input.person)
            organisation = Organisation.objects.get(id=input.organisation)

            organisation_person.person = person
            organisation_person.organisation = organisation
            organisation_person.kind = input.kind
            organisation_person.save()
        except:
            pass
        return UpdateOrganisationPersonMutation(partner=partner, status=status)


class DeleteOrganisationPersonMutation(graphene.Mutation):
    class Arguments:
        input = OrganisationPersonInput(
            required=True,
            description=("Fields required to create a product"),
        )

    organisation_person_id = graphene.Int()
    status = graphene.Boolean()

    @staticmethod
    def mutate(cls, instance, input=None):
        status = False
        organisation_person_id = None
        try:
            OrganisationPerson.objects.get(pk=id).delete()
            status = True
        except:
            pass
        return DeleteOrganisationPersonMutation(organisation_person_id=organisation_person_id,
                                        status=status)
