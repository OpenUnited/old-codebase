import graphene
from graphene_django.types import DjangoObjectType, ObjectType

from commercial.models import Organisation, Partner, OrganisationPerson


class OrganisationType(DjangoObjectType):
    photo = graphene.String(required=False)

    class Meta:
        model = Organisation

    def resolve_photo(self, info):
        """Resolve product image absolute path"""
        if self.photo:
            return info.context.build_absolute_uri(self.photo.url)
        return None


class OrganisationInput(graphene.InputObjectType):
    id = graphene.Int(
        description="Organisation Id. It is used when updating a organisation data",
        required=False
    )
    name = graphene.String(
        description="organisation name", required=True
    )


class PartnerType(DjangoObjectType):
    class Meta:
        model = Partner
        convert_choices_to_enum = False


class PartnerInput(graphene.InputObjectType):
    id = graphene.Int(
        description="Organisation Id. It is used when updating a organisation data",
        required=False
    )
    product = graphene.Int(
        description="product id", required=True
    )
    organisation = graphene.Int(
        description="organisation id", required=True
    )
    person = graphene.Int()


class OrganisationPersonType(DjangoObjectType):
    class Meta:
        model = OrganisationPerson


class OrganisationPersonInput(graphene.InputObjectType):
    id = graphene.Int(
        description="Organisation Id. It is used when updating a organisation data",
        required=False
    )
    organisation = graphene.Int(
        description="organisation id", required=True
    )
    person = graphene.Int(
        description="product id", required=True
    )
    right = graphene.Int()
