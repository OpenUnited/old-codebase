from talent.models import Person, ProductPerson
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.conf import settings


def logged_in_user(request):
    authorized_user = request.user
    return authorized_user


def get_current_user(info, input):
    user = info.context.user
    if not user.is_anonymous:
        return user

    user_id = input.get("user_id", None)
    if user_id and user_id != 0:
        return Person.objects.get(id=user_id)
    else:
        return None


def get_current_person(info, input_data=None):
    user = info.context.user

    if settings.FAKE_LOGIN_USER_ID:
        user_id = settings.FAKE_LOGIN_USER_ID
    elif input_data:
        user_id = input_data.get("user_id", None)  
    else:
        user_id = None

    if user.is_anonymous and user_id and user_id != 0:
        return Person.objects.filter(id=user_id).first()

    if user.is_anonymous:
        return None

    try:
        return Person.objects.get(user=user)
    except Person.DoesNotExist:
        return None


def is_admin(user_id, product_slug):
    if ProductPerson.objects.filter(
            person_id=user_id,
            product__slug=product_slug,
            right__in=[ProductPerson.PERSON_TYPE_PRODUCT_ADMIN]
    ).count() > 0:
        return True
    else:
        return False


def is_admin_or_manager(person, product_slug):
    if ProductPerson.objects.filter(
            person=person,
            product__slug=product_slug,
            right__in=[
                ProductPerson.PERSON_TYPE_PRODUCT_ADMIN,
                ProductPerson.PERSON_TYPE_PRODUCT_MANAGER
            ]
    ).count() > 0:
        return True
    else:
        return False


def get_paginator(query, page_size, page, paginated_type, **kwargs):
    paginator = Paginator(query, page_size)
    page = 1 if page == 0 else page
    try:
        page_obj = paginator.page(page)
    except PageNotAnInteger:
        page_obj = paginator.page(1)
    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)
    return paginated_type(
        page=page_obj.number,
        pages=paginator.num_pages,
        has_next=page_obj.has_next(),
        has_prev=page_obj.has_previous(),
        tasks=page_obj.object_list,
        **kwargs
    )


def make_filters(filters: dict) -> dict:
    pass
