from rest_framework import serializers
from .models import Budget, Expense, Debt, PayoffPlan

class DebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debt
        fields = ['id', 'name', 'interest_rate', 'min_payment', 'start_balance', 'current_balance']

class PayoffPlanSerializer(serializers.ModelSerializer):
    debts = DebtSerializer(many=True)

    class Meta:
        model = PayoffPlan
        fields = ['id', 'created_at', 'total_extra_payment', 'total_months', 'plan_summary', 'debts']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'category', 'amount', 'due_date']

class BudgetSerializer(serializers.ModelSerializer):
    expenses = ExpenseSerializer(many=True)

    class Meta:
        model = Budget
        fields = ['id', 'name', 'created_at', 'paycheck_amount', 'expenses']
    
    def create(self, validated_data):
        expenses_data = validated_data.pop('expenses')
        budget = Budget.objects.create(**validated_data)
        for expense_data in expenses_data:
            Expense.objects.create(budget=budget, **expense_data)
        return budget



