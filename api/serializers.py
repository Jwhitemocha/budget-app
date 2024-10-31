from rest_framework import serializers
from .models import Budget, Expense

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
