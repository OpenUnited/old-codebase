# -*- coding: utf-8 -*-
from django.core.management import BaseCommand, call_command
from django.db.utils import IntegrityError
from work.models import Task, TaskListing
from work.utils import get_person_data


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        tasks = Task.objects.all()
        for task in tasks.iterator():
            try:
                tasklisting = TaskListing.objects.get(task=task)
                tasklisting.in_review = task.taskclaim_set.filter(kind=0).exists()
                tasklisting.product_data = dict(
                    name=task.product.name,
                    slug=task.product.slug,
                    owner=task.product.get_product_owner().user.username,
                    website=task.product.website,
                    detail_url=task.product.detail_url,
                    video_url=task.product.video_url,
                ) if task.product else None
                tasklisting.save()
            except TaskListing.DoesNotExist:
                pass

        print("update task copies is finished!")
