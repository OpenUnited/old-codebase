# Generated by Django 3.1 on 2022-07-28 09:49

from django.db import migrations

def update_bounty_status(apps, schema_editor):
    Bounty = apps.get_model('work', 'Bounty')

    for bounty in Bounty.objects.all():
        challenge = bounty.challenge
        bounty.status = challenge.status
        bounty.is_active = True
        bounty.save()    

def reverse_func(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('work', '0101_auto_20220728_1547'),
    ]

    operations = [
        migrations.RunPython(update_bounty_status, reverse_func),
    ]