# Generated by Django 3.2.4 on 2021-10-25 09:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20211024_2211'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='contact',
            options={'default_permissions': ()},
        ),
        migrations.AlterModelOptions(
            name='settings',
            options={'default_permissions': (), 'permissions': [('change_settings', 'Can change settings')]},
        ),
    ]
