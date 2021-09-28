# Generated by Django 3.2.4 on 2021-09-28 08:10

import api.models.Reservation
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import kamenice_django.validators.guest


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('deleted', models.BooleanField(default=False)),
                ('message', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Guest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address_municipality', models.CharField(blank=True, max_length=100, null=True)),
                ('address_psc', models.IntegerField(blank=True, null=True)),
                ('address_street', models.CharField(blank=True, max_length=100, null=True)),
                ('age', models.CharField(blank=True, choices=[('INFANT', 'Up to 3 years'), ('CHILD', '3-12 years'), ('YOUNG', '12+ years'), ('ADULT', 'Adult')], error_messages={'invalid_choice': 'Choose age from the list'}, max_length=10, null=True)),
                ('citizenship', models.CharField(blank=True, max_length=10, null=True, validators=[kamenice_django.validators.guest.validate_citizenship])),
                ('email', models.EmailField(blank=True, error_messages={'invalid': 'Enter valid email address', 'unique': 'User with this email already exists'}, max_length=254, null=True, validators=[django.core.validators.EmailValidator()])),
                ('gender', models.CharField(blank=True, choices=[('M', 'Male'), ('F', 'Female')], error_messages={'invalid_choice': 'Choose gender from the list'}, max_length=10, null=True, validators=[kamenice_django.validators.guest.validate_gender])),
                ('identity', models.CharField(blank=True, max_length=50, null=True)),
                ('name', models.CharField(error_messages={'blank': 'Name is required field', 'null': 'Name is required field'}, max_length=100)),
                ('phone_number', models.CharField(blank=True, max_length=50, null=True)),
                ('surname', models.CharField(error_messages={'blank': 'Surname is required field', 'null': 'Surname is required field'}, max_length=100)),
                ('visa_number', models.CharField(blank=True, max_length=100, null=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('deleted', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Suite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(error_messages={'blank': 'Název apartmá je povinný údaj', 'null': 'Název apartmá je povinný údaj'}, max_length=100)),
                ('number', models.IntegerField(blank=True, null=True)),
                ('number_beds', models.IntegerField(default=2)),
                ('price_base', models.DecimalField(decimal_places=2, error_messages={'null': 'Base price is required field'}, max_digits=6)),
                ('price_child', models.DecimalField(decimal_places=2, error_messages={'null': 'Price for child is required field'}, max_digits=6)),
                ('price_extra', models.DecimalField(decimal_places=2, error_messages={'null': 'Price for extra bed is required field'}, max_digits=6)),
                ('price_infant', models.DecimalField(decimal_places=2, error_messages={'null': 'Price for child is required field'}, max_digits=6)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('deleted', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('deleted', models.BooleanField(default=False)),
                ('expired', models.DateTimeField(blank=True, error_messages={'invalid': 'Enter valid date for the expiration'}, null=True)),
                ('from_date', models.DateTimeField(error_messages={'invalid': 'Enter valid date for the reservation start date', 'null': 'Enter valid date for the reservation start date'})),
                ('hash', models.CharField(blank=True, default=api.models.Reservation.generate_reservation_hash, max_length=10, null=True)),
                ('meal', models.CharField(choices=[('NOMEAL', 'Meal not included'), ('BREAKFAST', 'Breakfast included'), ('HALFBOARD', 'Half board')], error_messages={'invalid_choice': 'Select Meal from the list', 'null': 'Select Meal from the list'}, max_length=50)),
                ('notes', models.TextField(blank=True, null=True)),
                ('price_accommodation', models.DecimalField(decimal_places=2, error_messages={'null': 'Price for accommodation is required field'}, max_digits=10)),
                ('price_extra', models.DecimalField(decimal_places=2, error_messages={'null': 'Price for extra bed(s) is required field'}, max_digits=10)),
                ('price_meal', models.DecimalField(decimal_places=2, error_messages={'null': 'Price for meal is required field'}, max_digits=10)),
                ('price_municipality', models.DecimalField(decimal_places=2, error_messages={'null': 'Municipality fee is required field'}, max_digits=10)),
                ('price_total', models.DecimalField(decimal_places=2, error_messages={'null': 'Total price is required field'}, max_digits=10)),
                ('purpose', models.CharField(blank=True, max_length=100, null=True)),
                ('to_date', models.DateTimeField(error_messages={'invalid': 'Enter valid date for the reservation end date', 'null': 'Enter valid date for the reservation end date'})),
                ('type', models.CharField(choices=[('ACCOMMODATED', 'Currently accommodated'), ('BINDING', 'Binding reservation'), ('INHABITED', 'Occupied term'), ('NONBINDING', 'Non-binding reservation')], error_messages={'invalid_choice': 'Select reservation type from the list', 'null': 'Select reservation type from the list'}, max_length=50)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('guest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.guest')),
                ('roommates', models.ManyToManyField(related_name='_api_reservation_roommates_+', to='api.Guest')),
                ('suite', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.suite')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
