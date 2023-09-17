from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from model_utils import FieldTracker
from notifications.signals import notify

import notification.tasks
from backend.mixins import TimeStampMixin, UUIDMixin
from notification.models import Notification
from talent.models import Person
from work.models import Bounty

CLAIM_TYPE_DONE = 0
CLAIM_TYPE_ACTIVE = 1
CLAIM_TYPE_FAILED = 2
CLAIM_TYPE_IN_REVIEW = 3


class BountyClaim(TimeStampMixin, UUIDMixin):
    CLAIM_TYPE = (
        (CLAIM_TYPE_DONE, "Done"),
        (CLAIM_TYPE_ACTIVE, "Active"),
        (CLAIM_TYPE_FAILED, "Failed"),
        (CLAIM_TYPE_IN_REVIEW, "In review")
    )
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, blank=True, null=True)
    kind = models.IntegerField(choices=CLAIM_TYPE, default=0)
    tracker = FieldTracker()

    def __str__(self):
        return '{}: {} ({})'.format(self.bounty.challenge, self.person, self.kind)


@receiver(post_save, sender=BountyClaim)
def save_bounty_claim(sender, instance, created, **kwargs):
    challenge = instance.bounty.challenge
    reviewer = getattr(challenge, "reviewer", None)
    contributor = instance.person
    contributor_email = contributor.email_address
    reviewer_user = reviewer.user if reviewer else None

    if not created:
        # contributor has submitted the work for review
        if instance.kind == CLAIM_TYPE_IN_REVIEW and instance.tracker.previous("kind") is not CLAIM_TYPE_IN_REVIEW:
            challenge = instance.bounty.challenge
            subject = f"The challenge \"{challenge.title}\" is ready to review"
            message = f"You can see the challenge here: {challenge.get_challenge_link()}"
            if reviewer:
                notify.send(instance, recipient=reviewer_user, verb=subject, description=message)
                notification.tasks.send_notification.delay([Notification.Type.EMAIL],
                                                           Notification.EventType.TASK_READY_TO_REVIEW,
                                                           receivers=[reviewer.id],
                                                           task_title=challenge.title,
                                                           task_link=challenge.get_challenge_link())


class BountyDeliveryAttempt(TimeStampMixin):
    SUBMISSION_TYPE_NEW = 0
    SUBMISSION_TYPE_APPROVED = 1
    SUBMISSION_TYPE_REJECTED = 2

    SUBMISSION_TYPES = (
        (SUBMISSION_TYPE_NEW, "New"),
        (SUBMISSION_TYPE_APPROVED, "Approved"),
        (SUBMISSION_TYPE_REJECTED, "Rejected"),
    )
    
    kind = models.IntegerField(choices=SUBMISSION_TYPES, default=0)
    bounty_claim = models.ForeignKey(BountyClaim, on_delete=models.CASCADE, blank=True, null=True,
                                   related_name="delivery_attempt")
    person = models.ForeignKey(Person, on_delete=models.CASCADE, blank=True, null=True)
    is_canceled = models.BooleanField(default=False)
    delivery_message = models.CharField(max_length=2000, default=None)
    tracker = FieldTracker()


class BountyDeliveryAttachment(models.Model):
    bounty_delivery_attempt = models.ForeignKey(BountyDeliveryAttempt, on_delete=models.CASCADE, related_name='attachments')
    file_type = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    path = models.CharField(max_length=100)


@receiver(post_save, sender=BountyDeliveryAttempt)
def save_bounty_claim_request(sender, instance, created, **kwargs):
    bounty_claim = instance.bounty_claim
    contributor = instance.person
    contributor_id = contributor.id
    reviewer = getattr(bounty_claim.bounty.challenge, "reviewer", None)
    reviewer_user = reviewer.user if reviewer else None

    # contributor request to claim it
    if created and not bounty_claim.bounty.challenge.auto_approve_task_claims:
        subject = f"A new bounty delivery attempt has been created"
        message = f"A new bounty delivery attempt has been created for the challenge: \"{bounty_claim.bounty.challenge.title}\""

        if reviewer:
            notify.send(instance, recipient=reviewer_user, verb=subject, description=message)
            notification.tasks.send_notification.delay([Notification.Type.EMAIL],
                                                       Notification.EventType.TASK_DELIVERY_ATTEMPT_CREATED,
                                                       receivers=[reviewer.id],
                                                       task_title=bounty_claim.bounty.challenge.title)
    if not created:
        # contributor quits the task
        if instance.is_canceled and not instance.tracker.previous("is_canceled"):
            subject = f"The contributor left the task"
            message = f"The contributor has left the task \"{bounty_claim.bounty.challenge.title}\""

            if reviewer:
                notify.send(instance, recipient=reviewer_user, verb=subject, description=message)
                notification.tasks.send_notification.delay([Notification.Type.EMAIL],
                                                           Notification.EventType.CONTRIBUTOR_LEFT_TASK,
                                                           receivers=[reviewer.id],
                                                           task_title=bounty_claim.bounty.challenge.title)

