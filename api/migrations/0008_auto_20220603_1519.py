# Generated by Django 3.2.12 on 2022-06-03 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_reservation_roommates'),
    ]

    operations = [
        migrations.AddField(
            model_name='settings',
            name='default_arrival_time',
            field=models.TimeField(default='15:00'),
        ),
        migrations.AddField(
            model_name='settings',
            name='default_departure_time',
            field=models.TimeField(default='10:00'),
        ),
    ]
