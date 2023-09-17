import notification.tasks
from notification.models import Notification


def save_history(created, instance, parent_type):
    from ideas_bugs.models import REJECTED_STATUS

    if created:
        parent = getattr(instance, parent_type, None)
        parent.status = instance.current_status
        parent.save()

        if instance.current_status == REJECTED_STATUS:
            receiver = instance.person.id

            # Send email to creator
            notification.tasks.send_notification.delay([Notification.Type.EMAIL],
                                                       Notification.EventType.IDEA_REJECTED if parent_type == 'idea' else Notification.EventType.BUG_REJECTED,
                                                       receivers=[receiver],
                                                       headline=parent.headline,
                                                       link=parent.get_ui_link(),
                                                       product=parent.product.name,
                                                       description=instance.description)


def save_idea_or_bug(created, instance, instance_type):
    if created:
        product_name = instance.product.name
        receiver = instance.person.id

        # Send email to creator
        notification.tasks.send_notification.delay([Notification.Type.EMAIL],
                                                   Notification.EventType.IDEA_CREATED if instance_type == 'idea' else Notification.EventType.BUG_CREATED,
                                                   receivers=[receiver],
                                                   headline=instance.headline,
                                                   link=instance.get_ui_link(),
                                                   product=product_name)

        # Send email to product members
        receivers = instance.product.get_members_ids()
        notification.tasks.send_notification.delay([Notification.Type.EMAIL],
                                                   Notification.EventType.IDEA_CREATED_FOR_MEMBERS if instance_type == 'idea' else Notification.EventType.BUG_CREATED_FOR_MEMBERS,
                                                   receivers=list(receivers),
                                                   headline=instance.headline,
                                                   link=instance.get_ui_link(),
                                                   product=product_name)
