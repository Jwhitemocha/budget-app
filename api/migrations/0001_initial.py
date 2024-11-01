# Generated by Django 5.1.2 on 2024-10-31 21:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Budget',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('created_at', models.DateField(auto_now_add=True)),
                ('paycheck_amount', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='PayoffPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('total_extra_payment', models.FloatField()),
                ('total_months', models.IntegerField()),
                ('user_id', models.IntegerField()),
                ('plan_summary', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=100)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('due_date', models.IntegerField()),
                ('budget', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='expenses', to='api.budget')),
            ],
        ),
        migrations.CreateModel(
            name='Debt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('interest_rate', models.FloatField()),
                ('min_payment', models.FloatField()),
                ('start_balance', models.FloatField()),
                ('current_balance', models.FloatField()),
                ('payoff_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='debts', to='api.payoffplan')),
            ],
        ),
    ]
