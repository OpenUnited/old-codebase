# Generated by Django 3.1 on 2021-04-27 14:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0002_auto_20210422_1054'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]