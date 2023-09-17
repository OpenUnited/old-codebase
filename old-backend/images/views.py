from django.http import HttpResponse
from backend.s3_controller import get_file_from_bucket


def get_attachment_image(request, name):
    return HttpResponse(get_file_from_bucket(name, subdir='attachments'), content_type="image/jpeg")


def get_product_image(request, name):
    return HttpResponse(get_file_from_bucket(name, subdir='products'), content_type="image/jpeg")


def get_review_attempt_attachment(request, name):
    return HttpResponse(get_file_from_bucket(name, subdir='review'), content_type="multipart/form-data")


def get_avatar(request, name):
    return HttpResponse(get_file_from_bucket(name, subdir='avatar'), content_type="multipart/form-data")
