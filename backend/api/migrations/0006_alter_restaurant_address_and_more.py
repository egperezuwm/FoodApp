# Generated by Django 5.1.6 on 2025-04-07 05:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_rename_restaurant_name_userprofile_restaurant'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='address',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='location_lat',
            field=models.FloatField(default=42.9744),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='location_lng',
            field=models.FloatField(default=87.938),
        ),
    ]
