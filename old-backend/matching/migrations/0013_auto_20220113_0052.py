# Generated by Django 3.1 on 2022-01-12 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matching', '0012_changes_for_portfolio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskdeliveryattempt',
            name='delivery_message',
            field=models.CharField(default=None, max_length=2000),
        ),
    ]
