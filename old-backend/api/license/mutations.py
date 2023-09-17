import graphene
from api.decorators import is_current_person
from api.license.inputs import LicenseInput, ContributionGuideInput
from api.mutations import StatusMessageMutation, ObjectExistsMutation
from api.utils import is_admin, is_admin_or_manager
from contribution_management.models import ContributorAgreement, ContributorAgreementAcceptance, ContributorGuide
from work.models import Product, Skill


class UpdateLicenseMutation(graphene.Mutation):
    class Arguments:
        license_input = LicenseInput(required=True)

    status = graphene.Boolean()
    message = graphene.String()

    @staticmethod
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        license_input = kwargs.get("license_input")
        if is_admin(user_id=current_person.id, product_slug=license_input.product_slug):
            ContributorAgreement.objects.create(
                product_id=Product.objects.get(slug=license_input.product_slug).id,
                agreement_content=license_input.content
            )

            return UpdateLicenseMutation(status=True, message="License has updated successfully")
        else:
            return UpdateLicenseMutation(status=False, message="You do not have permission for update license")


class AgreeLicenseMutation(graphene.Mutation):
    class Arguments:
        license_input = LicenseInput(required=True)

    status = graphene.Boolean()
    message = graphene.String()

    @staticmethod
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        license_input = kwargs.get("license_input")
        agreement = ContributorAgreement.objects.filter(product__slug=license_input.product_slug).last()
        if not agreement:
            return AgreeLicenseMutation(status=False, message="Agreement doesn't exist")

        contributor_data = dict(
            agreement_id=agreement.id,
            person_id=current_person.id
        )
        if not ContributorAgreementAcceptance.objects.filter(**contributor_data).exists():
            c_obj = ContributorAgreementAcceptance(**contributor_data)
            c_obj.save()

        return AgreeLicenseMutation(status=True, message="Agreement has accepted successfully")


class CreateContributionGuideMutation(graphene.Mutation, StatusMessageMutation):
    """Create a contribution guide"""

    class Arguments:
        input = ContributionGuideInput(required=True)

    @staticmethod
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        input_data = kwargs.get("input")
        product_slug = input_data.product_slug
        title = input_data.title

        try:
            product = Product.objects.get(slug=product_slug)
        except Product.DoesNotExist:
            return CreateContributionGuideMutation(status=False, message="Product doesn't exist")

        if not is_admin_or_manager(current_person, product_slug):
            return CreateContributionGuideMutation(status=False, message="You don't have permissions to do this action")

        if ContributorGuide.objects.filter(title=title).exists():
            return CreateContributionGuideMutation(status=False,
                                                   message=f"Contribution guide with title {title} already exist")

        category = None
        if input_data.category:
            category = Skill.objects.get(id=input_data.category)

        contribution_guide = ContributorGuide(
            title=title,
            description=input_data.description,
            product=product,
            category=category
        )
        contribution_guide.save()

        return CreateContributionGuideMutation(status=True, message="Contribution guide has been accepted successfully")


class UpdateContributionGuideMutation(graphene.Mutation, StatusMessageMutation):
    """Update a contribution guide"""

    class Arguments:
        id = graphene.Int()
        input = ContributionGuideInput(required=True)

    @staticmethod
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        pk = kwargs.get("id")
        input_data = kwargs.get("input")
        product_slug = input_data.product_slug
        title = input_data.title

        if not is_admin_or_manager(current_person, product_slug):
            return UpdateContributionGuideMutation(status=False, message="You don't have permissions to do this action")

        try:
            contribution_guide = ContributorGuide.objects.get(pk=pk)
        except ContributorGuide.DoesNotExist:
            return UpdateContributionGuideMutation(status=False, message="Contribution guide doesn't exist")

        if ContributorGuide.objects.filter(title=title).exclude(pk=pk).exists():
            return UpdateContributionGuideMutation(status=False,
                                                   message=f"Contribution guide with title {title} already exist")

        category = None
        if input_data.category:
            category = TaskCategory.objects.get(id=input_data.category)

        contribution_guide.title = title
        contribution_guide.description = input_data.description
        contribution_guide.category = category
        contribution_guide.save()

        return UpdateContributionGuideMutation(status=True, message="Contribution guide has been updated successfully")


class DeleteContributorGuideMutation(ObjectExistsMutation, graphene.Mutation):
    """Delete a contribution guide"""

    class Arguments:
        id = graphene.ID()

    @staticmethod
    @is_current_person
    def mutate(current_person, info, *args, **kwargs):
        pk = kwargs.get("id")

        try:
            c_guide = ContributorGuide.objects.get(id=pk)

            if not is_admin_or_manager(current_person, c_guide.product.slug):
                return UpdateContributionGuideMutation(status=False,
                                                       message="You don't have permissions to do this action")

            c_guide.delete()
            is_exists = True
        except ContributorGuide.DoesNotExist:
            is_exists = False
        return DeleteContributorGuideMutation(is_exists)


class LicenseMutations(graphene.ObjectType):
    update_license = UpdateLicenseMutation.Field()
    agree_license = AgreeLicenseMutation.Field()
    create_contribution_guide = CreateContributionGuideMutation.Field()
    update_contribution_guide = UpdateContributionGuideMutation.Field()
    delete_contribution_guide = DeleteContributorGuideMutation.Field()
