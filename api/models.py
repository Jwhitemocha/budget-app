from django.db import models

class PayoffPlan(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    total_extra_payment = models.FloatField()
    total_months = models.IntegerField()
    user_id = models.IntegerField()  
    plan_summary = models.TextField()  # Holds the detailed report

class Debt(models.Model):
    name = models.CharField(max_length=100)
    interest_rate = models.FloatField()
    min_payment = models.FloatField()
    start_balance = models.FloatField()
    current_balance = models.FloatField()
    payoff_plan = models.ForeignKey('PayoffPlan', related_name='debts', on_delete=models.CASCADE)

class Budget(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateField(auto_now_add=True)
    paycheck_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Expense(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="expenses")
    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.IntegerField()  # Day of the month the expense is due

    def __str__(self):
        return f"{self.category} - {self.amount}"



