from django.db import models
from work.models import Skill

class ContributorAgreement(models.Model):
    product = models.ForeignKey(to="work.Product", on_delete=models.CASCADE, related_name="product_contributor_agreement")
    agreement_content = models.TextField()

    class Meta:
        db_table = "contribution_management_contributor_agreement"


class ContributorAgreementAcceptance(models.Model):
    agreement = models.ForeignKey(to=ContributorAgreement, on_delete=models.CASCADE)
    person = models.ForeignKey(to='talent.Person', on_delete=models.CASCADE, related_name="person_contributor_agreement_acceptance")
    accepted_at = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        db_table = "contribution_management_contributor_agreement_acceptance"


class ContributorGuide(models.Model):
    product = models.ForeignKey(to="work.Product", on_delete=models.CASCADE, related_name="product_contributor_guide")
    title = models.CharField(max_length=60, unique=True)
    description = models.TextField(null=True, blank=True)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="category_contributor_guide", 
                                    blank=True, null=True, default=None)

    def __str__(self):
        return self.title
