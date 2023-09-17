from django.db import models


class Page(models.Model):
    title = models.CharField(max_length=256, unique=True)
    description = models.TextField(blank=True, null=True)
    slug = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.title
