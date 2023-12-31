# Generated by Django 3.1 on 2022-06-19 14:20

from django.db import migrations


def import_existing_data(apps, schema_editor):
    Task = apps.get_model('work', 'Task')
    TaskListing = apps.get_model('work', 'TaskListing')
    TaskDepend = apps.get_model('work', 'TaskDepend')
    Challenge = apps.get_model('work', 'Challenge')
    ChallengeListing = apps.get_model('work', 'ChallengeListing')
    ChallengeDepend = apps.get_model('work', 'ChallengeDepend')
    ProductTask = apps.get_model('work', 'ProductTask')
    ProductChallenge = apps.get_model('work', 'ProductChallenge')
    Bounty = apps.get_model('work', 'Bounty')
    Expertise = apps.get_model('work', 'Expertise')

    all_expertises = Expertise.objects.all()
    try:
        for expertise in all_expertises:
            expertise.skill = expertise.category
            expertise.save() 
    except:
        pass

    for task in Task.objects.all():
        challenge = Challenge()
        challenge.id = task.id
        challenge.title = task.title
        challenge.description = task.description
        challenge.short_description = task.short_description
        challenge.status = task.status
        challenge.skill = task.category
        challenge.blocked = task.blocked
        challenge.featured = task.featured
        challenge.priority = task.priority
        challenge.published_id = task.published_id
        challenge.auto_approve_task_claims = task.auto_approve_task_claims
        challenge.created_by = task.created_by
        challenge.updated_by = task.updated_by
        challenge.comments_start = task.comments_start
        challenge.reviewer = task.reviewer
        challenge.product = task.product
        challenge.video_url = task.video_url
        challenge.contribution_guide = task.contribution_guide
        challenge.uuid = task.uuid
        challenge.initiative = task.initiative
        challenge.capability = task.capability
        challenge.save()

        challenge.created_at = task.created_at
        challenge.updated_at = task.updated_at
        challenge.save()

        bounty = Bounty()
        bounty.challenge = challenge
        bounty.skill = challenge.skill
        bounty.points = 5
        bounty.save()
        bounty.created_at = challenge.created_at
        bounty.save()

        task_expertises = task.expertise.all()
        for expertise in task_expertises:
            challenge.expertise.add(expertise)
            bounty.expertise.add(expertise)
        task_attachments = task.attachment.all()
        for attachment in task_attachments:
            challenge.attachment.add(attachment)
        task_tags = task.tag.all()
        for tag in task_tags:
            challenge.tag.add(tag)

    for tl in TaskListing.objects.all():
        cl = ChallengeListing()
        cl.id = tl.id
        cl.challenge = Challenge.objects.get(id=tl.task.id)
        cl.title = tl.title
        cl.description = tl.description
        cl.short_description = tl.short_description
        cl.status = tl.status
        cl.tags = tl.tags
        cl.blocked = tl.blocked
        cl.featured = tl.featured
        cl.priority = tl.priority
        cl.published_id = tl.published_id
        cl.auto_approve_task_claims = tl.auto_approve_task_claims
        cl.task_creator = tl.task_creator
        cl.created_by = tl.created_by
        cl.updated_by = tl.updated_by
        cl.reviewer = tl.reviewer
        cl.product_data = tl.product_data
        cl.product = tl.product
        cl.video_url = tl.video_url
        cl.task_claim = tl.task_claim
        cl.assigned_to_data = tl.assigned_to_data
        cl.assigned_to_person = tl.assigned_to_person
        cl.has_active_depends = tl.has_active_depends
        cl.initiative = tl.initiative
        cl.initiative_data = tl.initiative_data
        cl.capability = tl.capability
        cl.capability_data = tl.capability_data
        cl.in_review = tl.in_review
        cl.save()

    for td in TaskDepend.objects.all():
        cd = ChallengeDepend()
        cd.id = td.id
        cd.challenge = Challenge.objects.get(id=td.task.id)
        cd.depends_by = Challenge.objects.get(id=td.depends_by.id)
        cd.save()

    for pt in ProductTask.objects.all():
        pc = ProductChallenge()
        pc.id = pt.id
        pc.product = pt.product
        pc.challenge = Challenge.objects.get(id=pt.task.id)
        pc.uuid = pt.uuid
        pc.save()
        pc.created_at = pt.created_at
        pc.updated_at = pt.updated_at
        pc.save()


def reverse_func(apps, schema_editor):
    Challenge = apps.get_model('work', 'Challenge')
    Challenge.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('work', '0098_auto_20220618_2252'),
    ]

    operations = [
        migrations.RunPython(import_existing_data, reverse_func),
    ]
