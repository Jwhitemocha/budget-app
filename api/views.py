# api/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Function to calculate monthly car loan payment
def calculate_car_loan(principal, annual_rate, years):
    monthly_rate = annual_rate / 12 / 100
    months = years * 12
    payment = principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)
    return round(payment, 2)

# Function to calculate remaining savings after expenses
def calculate_savings(income, expenses):
    remaining = income - expenses
    return round(remaining, 2)

# API view for car loan calculation
@api_view(['POST'])
def car_loan_view(request):
    data = request.data
    principal = data.get('principal')
    annual_rate = data.get('annual_rate')
    years = data.get('years')

    # Calculate the car loan payment
    payment = calculate_car_loan(principal, annual_rate, years)
    return Response({"payment": payment})

# API view for savings calculation
@api_view(['POST'])
def savings_view(request):
    data = request.data
    income = data.get('income')
    expenses = data.get('expenses')

    # Calculate remaining savings
    remaining_savings = calculate_savings(income, expenses)
    return Response({"remaining_savings": remaining_savings})
