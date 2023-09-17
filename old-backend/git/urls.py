# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import path
from git import views


urlpatterns = [
    path("webhook/", views.webhook, name="webhook"),
    path("detect_user/", views.detect_user, name="detect_user"),
    path("logout/", views.logout, name="logout"),
]
