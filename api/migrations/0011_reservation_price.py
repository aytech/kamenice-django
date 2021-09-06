# Generated by Django 3.2.4 on 2021-09-05 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_suite_number_beds'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0.0, error_messages={'null': 'Price is required field'}, max_digits=10),
            preserve_default=False,
        ),
    ]
