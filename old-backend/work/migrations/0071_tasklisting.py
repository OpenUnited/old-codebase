# Generated by Django 3.1 on 2021-04-13 07:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('work', '0070_auto_20210412_1232'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskListing',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('description', models.TextField()),
                ('short_description', models.TextField(max_length=256)),
                ('status', models.IntegerField(choices=[(0, 'Draft'), (1, 'Blocked'), (2, 'Available'), (3, 'Claimed'), (4, 'Done')], default=0)),
                ('tags', models.TextField()),
                ('stacks', models.TextField()),
                ('blocked', models.BooleanField(default=False)),
                ('featured', models.BooleanField(default=False)),
                ('priority', models.IntegerField(choices=[(0, 'High'), (1, 'Medium'), (2, 'Low')], default=1)),
                ('published_id', models.IntegerField(blank=True, default=0, editable=False)),
                ('auto_approve_task_claims', models.BooleanField(default=True)),
                ('created_by', models.JSONField()),
                ('updated_by', models.JSONField()),
                ('reviewer', models.JSONField()),
                ('product', models.IntegerField()),
                ('target_work_location', models.TextField()),
                ('task_claim', models.JSONField()),
                ('assign_to', models.JSONField()),
                ('has_active_depends', models.BooleanField(default=False)),
                ('initiative', models.IntegerField()),
                ('capability', models.IntegerField()),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='work.task')),
            ],
        ),
    ]
