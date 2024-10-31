from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BudgetViewSet, ExpenseViewSet, PayoffPlanViewSet

router = DefaultRouter()
router.register(r'budgets', BudgetViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'payoff-plans', PayoffPlanViewSet, basename='payoff-plan')

urlpatterns = [
    path('', include(router.urls)),
]
