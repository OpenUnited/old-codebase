# -*- coding: utf-8 -*-
from django.core.management import BaseCommand, call_command
from django.db.utils import IntegrityError
from talent.models import Person
from users.models import User


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        for p in Person.objects.all():
            try:
                User.objects.create(username=p.slug, person=p)
            except IntegrityError:
                pass
