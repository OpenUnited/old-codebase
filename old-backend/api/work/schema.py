from api.work.inputs import TaskListInput, InitiativeListInput
from .mutations import *
from talent.models import ProductPerson
from work.models import ChallengeListing
from api.utils import logged_in_user, get_current_person

from api.work.utils import get_tasks, get_tasks_by_product, get_task_category_listing, get_categories, get_expertises_listing
from ..decorators import get_logged_person


class ProductQuery(ObjectType):
    product = graphene.Field(ProductType, slug=graphene.String())
    products = graphene.List(ProductType)
    user_person = graphene.String(slug=graphene.String())
    tags = graphene.List(TagType, product_slug=graphene.String(required=False))

    @staticmethod
    def is_visible_for_person_filter(product, person):
        if not product.is_private:
            return True
        else:
            for product_person in ProductPerson.objects.filter(product=product, person=person):
                if product_person.right in [
                    ProductPerson.PERSON_TYPE_PRODUCT_ADMIN,
                    ProductPerson.PERSON_TYPE_PRODUCT_MANAGER,
                    ProductPerson.PERSON_TYPE_USER
                ]:
                    return True

        return False

    @staticmethod
    @get_logged_person
    def resolve_product(current_person, info, *args, slug):
        try:
            product = Product.objects.get(slug=slug)

            if not product.is_private:
                return product
            elif current_person and ProductQuery.is_visible_for_person_filter(product, current_person):
                return product
            else:
                return None
        except:
            return None

    @staticmethod
    @get_logged_person
    def resolve_products(current_person, info, *args, stack_filter=None):
        if stack_filter and stack_filter.stacks and len(stack_filter.stacks) > 0:
            suitable_tasks = Challenge.objects.filter(
                status=Challenge.CHALLENGE_STATUS_AVAILABLE,
                stack__name__in=stack_filter.stacks,
            )
            products = Product.objects.filter(producttask__task__in=suitable_tasks).distinct()
        else:
            products = Product.objects.all()

        if current_person:
            products = list(
                filter(lambda product: ProductQuery.is_visible_for_person_filter(product, current_person), products)
            )
        else:
            products = products.filter(is_private=False)

        return products

    @staticmethod
    def resolve_user_person(self, info, **kwargs):
        slug = kwargs.get('slug')
        if slug is not None:
            current_user = logged_in_user()
            try:
                person = ProductPerson.objects.get(
                    person=current_user,
                    product__slug=slug
                )
                return ProductPerson.PERSON_TYPE[person.right][1]
            except:
                return None
        return None

    @staticmethod
    def resolve_tags(*args, product_slug=None):
        if product_slug:
            tasks = Challenge.objects.filter(productchallenge__product__slug=product_slug)
            tags_for_product = Tag.objects.filter(challenge_tags__in=tasks).distinct()
            return tags_for_product

        return Tag.objects.all()


class CapabilityQuery(ObjectType):
    capability = graphene.Field(CapabilityTaskType, node_id=graphene.Int(), input=TaskListInput())
    capabilities = graphene.JSONString(product_slug=graphene.String())
    capabilities_as_list = graphene.List(CapabilityType, product_slug=graphene.String())
    capability_parent_crumbs = graphene.JSONString(node_id=graphene.Int())

    @staticmethod
    def resolve_capability(self, info, **kwargs):
        node_id = kwargs.get('node_id')
        input_data = kwargs.get('input')
        exclude_data = None

        current_person = get_current_person(info, kwargs)
        if not current_person:
            exclude_data = {"status__in": [0, 1]}

        if node_id is not None:
            capability = Capability.objects.get(pk=node_id)
            tasks = ChallengeListing.get_filtered_data(input_data, {"capability_id": node_id}, exclude_data)
            return CapabilityTaskType(capability=capability, tasks=tasks)

        return None

    @staticmethod
    def resolve_capabilities(self, info, **kwargs):
        try:
            product_slug = kwargs.get('product_slug')

            if product_slug is not None:
                node_id = Product.objects.get(slug=product_slug).capability_start_id

                return Capability.dump_bulk(parent=Capability.objects.get(pk=node_id))
            else:
                return None
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def resolve_capabilities_as_list(self, info, **kwargs):
        try:
            product_slug = kwargs.get('product_slug')

            if product_slug is not None:
                node_id = Product.objects.get(slug=product_slug).capability_start_id

                # Return all capabilities of product and cut root node
                return Capability.get_tree(parent=Capability.objects.get(pk=node_id))[1:]
            else:
                return None
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def resolve_capability_parent_crumbs(*args, **kwargs):
        try:
            node_id = kwargs.get('node_id')

            if node_id is not None:
                parent_crumbs = Capability.objects.get(pk=node_id).get_ancestors()[1:]
                parent_crumbs_with_siblings = []

                for crumb in parent_crumbs:
                    siblings = crumb.get_siblings()
                    formatted_siblings = []

                    for sibling in siblings:
                        if sibling.id != crumb.id:
                            formatted_siblings.append({
                                'id': sibling.id,
                                'name': sibling.name,
                            })

                    parent_crumbs_with_siblings.append({
                        'id': crumb.id,
                        'name': crumb.name,
                        'siblings': formatted_siblings
                    })

                return parent_crumbs_with_siblings
            else:
                return None
        except:
            return None


class InitiativeQuery(ObjectType):
    initiatives = graphene.List(InitiativeType, product_slug=graphene.String(), status=graphene.Int(), input=InitiativeListInput())
    initiative = graphene.Field(InitiativeTaskType, id=graphene.Int(), input=TaskListInput())

    @staticmethod
    def resolve_initiative(self, info, **kwargs):
        initiative_id = kwargs.get('id')
        input_data = kwargs.get('input')
        exclude_data = None

        current_person = get_current_person(info, kwargs)
        if not current_person:
            exclude_data = {"status__in": [0, 1]}

        if initiative_id is not None:
            initiative = Initiative.objects.get(pk=initiative_id)
            tasks = ChallengeListing.get_filtered_data(input_data, {"initiative_id": initiative_id}, exclude_data)
            return InitiativeTaskType(initiative=initiative, tasks=tasks)

        return None

    @staticmethod
    def resolve_initiatives(*args, **kwargs):
        filtered_data = dict()
        product_slug = kwargs.get("product_slug")
        status = kwargs.get("status")
        input_data = kwargs.get("input")
        if product_slug:
            filtered_data["product__slug"] = product_slug

        if status:
            filtered_data["status"] = status

        initiatives = Initiative.get_filtered_data(input_data, filtered_data)

        return initiatives


class TaskQuery(ObjectType):
    tasks = graphene.List(
        TaskType,
        input=TaskListInput()
    )

    tasklisting = graphene.List(
        TaskListingType,
        input=TaskListInput()
    )

    tasks_by_product = graphene.List(
        TaskType,
        product_slug=graphene.String(required=False),
        review_id=graphene.Int(required=False),
        input=TaskListInput()
    )

    tasklisting_by_product = graphene.List(
        TaskListingType,
        product_slug=graphene.String(required=False),
        review_id=graphene.Int(required=False),
        input=TaskListInput()
    )

    tasks_by_product_count = graphene.Int(
        product_slug=graphene.String(required=False),
        input=TaskListInput()
    )

    tasklisting_by_product_count = graphene.Int(
        product_slug=graphene.String(required=False),
        input=TaskListInput()
    )

    task = graphene.Field(TaskType, published_id=graphene.Int(), product_slug=graphene.String())
    status_list = graphene.List(graphene.String)

    @staticmethod
    def resolve_tasklisting(root, info, **kwargs):
        return get_tasks(ChallengeListing, info, kwargs)

    @staticmethod
    def resolve_tasks(root, info, **kwargs):
        return get_tasks(Challenge, info, kwargs)

    @staticmethod
    def resolve_tasks_by_product(self, info, **kwargs):
        return get_tasks_by_product(Challenge, info, kwargs)

    @staticmethod
    def resolve_tasklisting_by_product(self, info, **kwargs):
        return get_tasks_by_product(ChallengeListing, info, kwargs)

    @staticmethod
    def resolve_tasks_by_product_count(self, info, **kwargs):
        return get_tasks_by_product(Challenge, info, kwargs, True)

    @staticmethod
    def resolve_tasklisting_by_product_count(self, info, **kwargs):
        return get_tasks_by_product(ChallengeListing, info, kwargs, True)

    @staticmethod
    def resolve_task(*args, **kwargs):
        try:
            published_id = kwargs.get('published_id')
            product_slug = kwargs.get('product_slug')

            return ProductChallenge.objects.get(product__slug=product_slug, challenge__published_id=published_id).challenge
        except Exception as ex:
            print(ex)
            return None

    @staticmethod
    def resolve_status_list(*args, **kwargs):
        res = []
        for (idx, status) in Challenge.CHALLENGE_STATUS:
            res.append(status)
        return res


class TaskCategoryQuery(ObjectType):
    task_category_listing = graphene.JSONString(object_id=graphene.Int())
    categories = graphene.List(graphene.String)

    @staticmethod
    def resolve_task_category_listing(info, *args, **kwargs):
        return get_task_category_listing(Skill, info, *args, **kwargs)

    @staticmethod
    def resolve_categories(info, *args, **kwargs):
        return get_categories(Skill, info, *args, **kwargs)


class ExpertiseQuery(ObjectType):
    expertises_listing = graphene.JSONString(object_id=graphene.Int())

    @staticmethod
    def resolve_expertises_listing(info, *args, **kwargs):
        return get_expertises_listing(Expertise, info, *args, **kwargs)


class CodeRepositoryQuery(ObjectType):
    code_repositories = graphene.List(CodeRepositoryType)
    code_repository = graphene.Field(CodeRepositoryType, id=graphene.Int())

    @staticmethod
    def resolve_code_repository(self, info, **kwargs):
        slug_id = kwargs.get('id')

        if slug_id is not None:
            try:
                return CodeRepository.objects.get(id=id)
            except:
                return None

        return None

    @staticmethod
    def resolve_code_repositories(self, info, query=None, **kwargs):
        product_slug = kwargs.get('product_slug')
        qs = CodeRepository.objects.filter(product__slug=product_slug)
        return qs
