from django.urls import path
from .views import get_attachment_image
from .views import get_product_image
from .views import get_review_attempt_attachment
from .views import get_avatar

urlpatterns = [
    path('attachments/<name>', get_attachment_image, name='attachment_images'),
    path('products/<name>', get_product_image, name='product_images'),
    path('review/<name>', get_review_attempt_attachment, name='review_files'),
    path('avatar/<name>', get_avatar, name='avatar')
]
