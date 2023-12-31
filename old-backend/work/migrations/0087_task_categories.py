# Generated by Django 3.1 on 2021-06-21 12:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('work', '0086_task_delivery_attempt'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=100)),
                ('expertise', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='TaskCategoryList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(db_index=True, default=False)),
                ('selectable', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('expertise', models.JSONField(blank=True, null=True)),
                ('parent', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='work.taskcategorylist')),
            ],
        ),
        migrations.RemoveField(
            model_name='task',
            name='stack',
        ),
        migrations.RemoveField(
            model_name='tasklisting',
            name='stacks',
        ),
        migrations.DeleteModel(
            name='CapabilityStack',
        ),
        migrations.DeleteModel(
            name='Stack',
        ),
        migrations.AddField(
            model_name='task',
            name='category',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task', to='work.taskcategory'),
        ),
    ]
