# Generated by Django 3.1 on 2021-10-31 17:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contribution_management', '0001_initial'),
        ('work', '0089_constraints_update'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='contribution_guide',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='contribution_management.contributorguide'),
        ),
    ]
