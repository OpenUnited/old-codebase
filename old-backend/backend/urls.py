import os
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from graphene_file_upload.django import FileUploadGraphQLView
from api.schema import schema
from django.views.decorators.csrf import csrf_exempt
from backend import views


urlpatterns = []
ADMIN_PATH = os.environ.get('ADMIN_PATH')


if ADMIN_PATH:
    urlpatterns.append(
        path(f'admin/{ADMIN_PATH}/', admin.site.urls),
    )


urlpatterns += [
    path("graphql", csrf_exempt(FileUploadGraphQLView.as_view(schema=schema, graphiql=False)), name="api"),
    path("github/", include("git.urls")),
    path("oidc-callback", views.OIDCallbackView.as_view(), name="oidc-callback"),
    path("oidc-logout-callback", views.OIDCallbackLogoutView.as_view(), name="auth-logout-callback"),
    path('images/', include('images.urls'), name='images'),
    path('summernote/', include('django_summernote.urls')),
] + static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.site_header = "OpenUnited Admin"
admin.site.site_title = "OpenUnited Admin Portal"
admin.site.index_title = "OpenUnited Product Factory Admin"
