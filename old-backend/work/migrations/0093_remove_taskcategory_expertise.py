# Generated by Django 3.1 on 2021-11-26 10:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('work', '0092_auto_20211126_0943'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='taskcategory',
            name='expertise',
        ),
    ]
