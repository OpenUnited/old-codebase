from datetime import datetime

from users.models import User
from api.auth.authmachine_client import AuthMachineClient
from talent.models import Person, ProductPerson, SocialAccount
from work.models import Product


def get_person_available_slug(person_input, slug_increment):
    return person_input["username"] + ("" if slug_increment == 0 else f"-{slug_increment}")


def sign_up(person_input, slug_increment):
    available_slug = get_person_available_slug(person_input, slug_increment)
    is_exists_person_by_username = Person.objects.filter(user__username=available_slug).exists()
    is_exists_user_by_slug = User.objects.filter(username=available_slug).exists()

    user_email = person_input["email"]

    if is_exists_person_by_username or is_exists_user_by_slug:
        user = sign_up(person_input, slug_increment + 1)
    else:
        user = User.objects.create_user(
            username=available_slug,
            email=user_email,
        )

        first_name = person_input.get("name", "")
        if not first_name:
            first_name = available_slug

        Person.objects.create(
            first_name=first_name,
            email_address=user_email,
            slug=available_slug,
            user_id=user.id
        )

        social_account_data = dict(
            user_id=user.id,
            uid=person_input.get("id", ""),
            provider="authmachine"
        )

        if not SocialAccount.objects.filter(**social_account_data).exists():
            SocialAccount.objects.create(**social_account_data)

    return user


def update_user(person_input, user):
    uid = person_input.get("id", "")
    provider = "authmachine"

    first_name = person_input.get("name", "")
    if not first_name:
        first_name = user.username

    try:
        person = Person.objects.get(user_id=user.id)
        person.first_name = first_name
        person.save()
    except Person.DoesNotExist:
        uname = user.username
        slug_increment = 0
        while User.objects.filter(username=uname).exists():
            slug_increment += 1
            uname = f"{user.username}{slug_increment}"

        Person.objects.create(
            first_name=first_name,
            email_address=user.email,
            slug=uname,
            user_id=user.id
        )

    try:
        social_account = SocialAccount.objects.get(user_id=user.id, provider=provider)
        social_account.last_login = datetime.now()
        social_account.extra_data = person_input
        social_account.uid = uid
        social_account.save()
    except SocialAccount.DoesNotExist:
        SocialAccount.objects.create(
            extra_data=person_input,
            uid=uid,
            user_id=user.id,
            provider=provider
        )
    except Exception:
        pass
    return user


def get_permission_value(perm_name):
    permissions = {
        "user": 1,
        "productadmin": 2,
        "productmanager": 3,
        "contributor": 4,
        "superadmin": 5,
    }
    return permissions.get(perm_name, None)


def update_user_permissions(request, user, provider_user_id):
    client = AuthMachineClient(request)
    permission_data = client.get_permissions(user_id=provider_user_id,
                                             objects=Product.objects.all().values_list("slug", flat=True))
    is_superuser = permission_data.get("is_superuser", False)
    permissions = permission_data.get("permissions", [])
    user.is_superuser = is_superuser
    user.save()

    try:
        person = Person.objects.get(user=user)
        for index, perm_name in enumerate(permissions):
            permission_list = permissions[perm_name]
            product = Product.objects.get(slug=perm_name)
            # remove all permission
            person.productperson_set.filter(product=product).all().delete()
            # update permissions list
            if permission_list:
                permissions_queryset = list()
                for m in permission_list:
                    perm_right = get_permission_value(m.replace("_", ""))
                    if perm_right:
                        permissions_queryset.append(
                            ProductPerson(
                                person=person,
                                product=product,
                                right=perm_right
                            )
                        )
                ProductPerson.objects.bulk_create(permissions_queryset)
    except (Person.DoesNotExist, Product.DoesNotExist) as e:
        print("Exception: ", e, flush=True)
