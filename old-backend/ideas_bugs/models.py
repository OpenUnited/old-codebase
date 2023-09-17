from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from backend.mixins import TimeStampMixin, UUIDMixin, VoteMixin
from ideas_bugs.utils import save_history, save_idea_or_bug
from talent.models import Person
from work.models import Product, Capability

SUBMITTED_STATUS = 0
ACCEPTED_STATUS = 1
REJECTED_STATUS = 2
RESOLVED_STATUS = 3


ACTION_STATUSES = (
    (SUBMITTED_STATUS, "Submitted"),
    (ACCEPTED_STATUS, "Accepted"),
    (REJECTED_STATUS, "Rejected"),
    (RESOLVED_STATUS, "Resolved"),
)


class Bug(TimeStampMixin, UUIDMixin):
    person = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    headline = models.CharField(max_length=80, verbose_name=_("Please give your bug a name"))
    bug_type = models.BooleanField(default=False, verbose_name=_("Is this bug security related?"))
    related_capability = models.ForeignKey(Capability, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(verbose_name=_("Please describe the Bug"))
    comments_start = models.ForeignKey(to='comments.bugcomment', on_delete=models.SET_NULL, null=True, editable=False)
    status = models.IntegerField(default=SUBMITTED_STATUS, choices=ACTION_STATUSES)

    def __str__(self):
        return self.headline

    def get_ui_link(self):
        product_owner = self.product.get_product_owner()
        return f"{settings.FRONT_END_SERVER}/{product_owner.username}/{self.product.slug}/bugs/{self.pk}"


@receiver(post_save, sender=Bug)
def save_bug(sender, instance, created, **kwargs):
    save_idea_or_bug(created, instance, "bug")


class Idea(TimeStampMixin, UUIDMixin):

    IDEA_TYPES = (
        (0, "Product Tweak"),
        (1, "New Feature"),
        (2, "New Capability"),
        (3, "Non-Functional Improvement"),
        (4, "Other")
    )

    person = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    headline = models.CharField(max_length=80, verbose_name=_("Please give your idea a name"))
    idea_type = models.IntegerField(choices=IDEA_TYPES,
                                    null=True,
                                    blank=True,
                                    default=None,
                                    verbose_name=_("Which of the following best matches your idea?"))
    related_capability = models.ForeignKey(Capability, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(verbose_name=_("Please describe your idea"))
    comments_start = models.ForeignKey(to='comments.ideacomment', on_delete=models.SET_NULL, null=True, editable=False)
    status = models.IntegerField(default=SUBMITTED_STATUS, choices=ACTION_STATUSES)

    def __str__(self):
        return self.headline

    def get_ui_link(self):
        product_owner = self.product.get_product_owner()
        return f"{settings.FRONT_END_SERVER}/{product_owner.username}/{self.product.slug}/ideas/{self.pk}"


@receiver(post_save, sender=Idea)
def save_idea(sender, instance, created, **kwargs):
    save_idea_or_bug(created, instance, "idea")


class IdeaVote(VoteMixin):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE)


class BugVote(VoteMixin):
    bug = models.ForeignKey(Bug, on_delete=models.CASCADE)


class StatusHistory(models.Model):
    person = models.ForeignKey(Person, on_delete=models.SET_NULL, null=True)
    prev_status = models.IntegerField(choices=ACTION_STATUSES)
    current_status = models.IntegerField(choices=ACTION_STATUSES)
    description = models.TextField()

    class Meta:
        abstract = True


class IdeaStatusHistory(StatusHistory):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE)


@receiver(post_save, sender=IdeaStatusHistory)
def save_idea_status(sender, instance, created, **kwargs):
    save_history(created, instance, "idea")


class BugStatusHistory(StatusHistory):
    bug = models.ForeignKey(Bug, on_delete=models.CASCADE)


@receiver(post_save, sender=BugStatusHistory)
def save_bug_status(sender, instance, created, **kwargs):
    save_history(created, instance, "bug")

