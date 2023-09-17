# -*- coding: utf-8 -*-
from django.core.management import BaseCommand

from notification.models import EmailNotification, Notification
from work.models import *


class Command(BaseCommand):
    def add_arguments(self, parser):
        pass

    def create_notification(self):
        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.TASK_CLAIMED,
            defaults={  
                'permitted_params': 'task_id,user',
                'title': 'Claim of task {task_id}',
                'template': 'The task {task_id} has been claimed by {user}.'
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.SUBMISSION_APPROVED,
            defaults={
                'permitted_params': 'task_id,user',
                'title': 'Task {task_id} approved',
                'template': 'The submission of task {task_id} by {user} has been approved.'
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.SUBMISSION_REJECTED,
            defaults={
                'permitted_params': 'task_id,user',
                'title': 'Task {task_id} rejected',
                'template': 'The submission of task {task_id} by {user} was rejected.'
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.SUBMISSION_REVISION_REQUESTED,
            defaults={
                'permitted_params': 'task_id,user',
                'title': 'Task {task_id} revision requested',
                'template': 'Revision was requested for the submission of task {task_id} by {user}.'
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.BUG_REJECTED,
            defaults={
                'permitted_params': 'headline,link,product,description',
                'title': 'The bug was rejected',
                'template': '''<p>The <strong>&laquo;{headline}&raquo;</strong> bug for product <strong>&laquo;{product}&raquo;</strong> was rejected.</p>
                            <p>Explanation of the decision:</p>
                            <blockquote>{description}</blockquote>'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.IDEA_REJECTED,
            defaults={
                'permitted_params': 'headline,link,product,description',
                'title': 'The idea was rejected',
                'template': '''<p>The <strong>&laquo;{headline}&raquo;</strong> idea for product <strong>&laquo;{product}&raquo;</strong> was rejected.</p>
                        <p>Explanation of the decision:</p>
                        <blockquote>{description}</blockquote>'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.BUG_CREATED,
            defaults={
                'permitted_params': 'headline,link,product',
                'title': 'New bug successfully created',
                'template': '''The <strong>&laquo;{headline}&raquo;</strong> bug for product <strong>&laquo;{product}&raquo;</strong> is successfully created.
                        You can see the bug here: <a href="{link}" target="_blank">{link}</a>'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.IDEA_CREATED,
            defaults={
                'permitted_params': 'headline,link,product',
                'title': 'New idea successfully created',
                'template': '''The <strong>&laquo;{headline}&raquo;</strong> idea for product <strong>&laquo;{product}&raquo;</strong> is successfully created.
                        You can see the idea here: <a href="{link}" target="_blank">{link}</a>'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.BUG_CREATED_FOR_MEMBERS,
            defaults={
                'permitted_params': 'headline,link,product',
                'title': 'New bug for {product} was created',
                'template': '''The <strong>&laquo;{headline}&raquo;</strong> bug for product <strong>&laquo;{product}&raquo;</strong> was created.
                        The bug is available here: <a href="{link}" target="_blank">{link}</a>'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.IDEA_CREATED_FOR_MEMBERS,
            defaults={
                'permitted_params': 'headline,link,product',
                'title': 'New idea for {product} was created',
                'template': '''The <strong>&laquo;{headline}&raquo;</strong> idea for product <strong>&laquo;{product}&raquo;</strong> was created.
                        The idea is available here: <a href="{link}" target="_blank">{link}</a>'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.TASK_STATUS_CHANGED,
            defaults={
                'permitted_params': 'title,link',
                'title': 'Task status changed',
                'template': '''The task {title} is claimed now.
                    You can see the task here: {link}'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.TASK_IN_REVIEW,
            defaults={
                'permitted_params': 'title,link',
                'title': 'The task status was changed to "In review"',
                'template': '''The task {title} status was changed to "In review".
                        You can see the task here: {link}'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.GENERIC_COMMENT,
            defaults={
                'permitted_params': 'text',
                'title': 'You have been mentioned in the comment',
                'template': '''{text}'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.TASK_SUBMITTED,
            defaults={
                'permitted_params': 'task_title,task_link,person_first_name',
                'title': 'Task has been submitted',
                'template': '''The task {task_title} has been submitted by {person_first_name}.
                        You can see the task here: {task_link}'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.TASK_READY_TO_REVIEW,
            defaults={
                'permitted_params': 'task_title,task_link',
                'title': 'The task "{task_title}" is ready to review',
                'template': '''You can see the task here: {task_link}'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.TASK_DELIVERY_ATTEMPT_CREATED,
            defaults={
                'permitted_params': 'task_title',
                'title': 'A new task delivery attempt has been created',
                'template': '''A new task delivery attempt has been created for the "{task_title}" task'''
            }
        )

        EmailNotification.objects.update_or_create(
            event_type=Notification.EventType.CONTRIBUTOR_LEFT_TASK,
            defaults={
                'permitted_params': 'task_title',
                'title': 'The contributor leave the task',
                'template': ''' The contributor leave the task "{task_title}"'''
            }
        )

    def handle(self, *args, **options):
        # Create notification
        self.create_notification()
