# Generated by Django 3.2.4 on 2021-07-26 09:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_guest_age'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='suite',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.suite'),
        ),
    ]