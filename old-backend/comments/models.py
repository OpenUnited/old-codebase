from django.db import models
from treebeard.mp_tree import MP_Node
from talent.models import Person


class Comment(MP_Node):
    person = models.ForeignKey(Person, on_delete=models.CASCADE, blank=True, null=True)
    text = models.TextField(max_length=1000)

    class Meta:
        abstract = True

    def __str__(self):
        return self.text


class ChallengeComment(Comment):
    pass


class BugComment(Comment):
    pass


class IdeaComment(Comment):
    pass


class CapabilityComment(Comment):
    pass
