# Generated by Django 3.1 on 2021-11-25 09:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('work', '0090_auto_20211031_1734'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='category',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task', to='work.taskcategorylist'),
        ),
        migrations.DeleteModel(
            name='TaskCategory',
        ),
    ]
