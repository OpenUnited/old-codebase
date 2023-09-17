# -*- coding: utf-8 -*-
from django.core.management import BaseCommand, call_command
from django.db.utils import IntegrityError
from work.utils import to_dict
from work.models import Task, TaskListing
from work.utils import get_person_data


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        tasks = Task.objects.all()
        for task in tasks.iterator():
            tasklisting = TaskListing.objects.create(
                task=task,
                title=task.title,
                description=task.description,
                short_description=task.short_description,
                status=task.status,
                tags=list(task.tag.all().values_list('name', flat=True)),
                blocked=task.blocked,
                featured=task.featured,
                priority=task.priority,
                published_id=task.published_id,
                auto_approve_task_claims=task.auto_approve_task_claims,
                task_creator=task.created_by,
                created_by=get_person_data(task.created_by),
                updated_by=get_person_data(task.updated_by),
                reviewer=get_person_data(task.reviewer) if task.reviewer else None,
                product_data={
                    "name": task.product.name,
                    "slug": task.product.slug,
                    "owner": task.product.get_product_owner().user.username
                } if task.product else None,
                product=task.product,
                has_active_depends=Task.objects.filter(taskdepend__task=task.id).exclude(
                    status=Task.TASK_STATUS_DONE).exists(),
                initiative=task.initiative,
                initiative_data=to_dict(task.initiative) if task.initiative else None,
                capability=task.capability,
                capability_data=to_dict(task.capability) if task.capability else None,
                video_url=task.video_url,
            )
            task_claim = task.taskclaim_set.filter(kind__in=[0, 1]).first()
            if task_claim:
                tasklisting.task_claim = to_dict(task_claim)
                tasklisting.assigned_to_data = get_person_data(task_claim.person)
                tasklisting.assigned_to_person = task_claim.person
            tasklisting.save()

        print("create task copies is finished!")
