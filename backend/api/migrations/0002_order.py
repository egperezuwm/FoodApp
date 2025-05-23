# Generated by Django 5.1.6 on 2025-04-02 03:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('platform', models.CharField(choices=[('DoorDash', 'DoorDash'), ('UberEats', 'UberEats')], max_length=20)),
                ('customer_name', models.CharField(max_length=50)),
                ('item_count', models.PositiveIntegerField()),
                ('total_cost', models.DecimalField(decimal_places=2, max_digits=8)),
                ('eta', models.PositiveIntegerField()),
                ('status', models.CharField(default='Pending', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
