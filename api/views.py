from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Budget, Expense, PayoffPlan, Debt
from .serializers import BudgetSerializer, ExpenseSerializer, PayoffPlanSerializer, DebtSerializer
import json 

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

class PayoffPlanViewSet(viewsets.ModelViewSet):
    queryset = PayoffPlan.objects.all()
    serializer_class = PayoffPlanSerializer

    @action(detail=False, methods=['post'])
    def save_plan(self, request):
        print("Received data:", json.dumps(request.data, indent=4)) # logging incoming data

        data = request.data
        debts_data = data.pop('debts')
        payoff_plan_serializer = PayoffPlanSerializer(data=data)

        if payoff_plan_serializer.is_valid():
            payoff_plan = payoff_plan_serializer.save()

            for debt_data in debts_data:
                debt_data['payoff_plan'] = payoff_plan.id
                debt_serializer = DebtSerializer(data=debt_data)
                if debt_serializer.is_valid():
                    debt_serializer.save()
                else:
                    return Response(debt_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(payoff_plan_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(payoff_plan_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def list_plans(self, request):
        user_id = request.query_params.get('user_id')  # Filter by user_id if needed
        plans = PayoffPlan.objects.filter(user_id=user_id) if user_id else PayoffPlan.objects.all()
        serializer = PayoffPlanSerializer(plans, many=True)
        return Response(serializer.data)