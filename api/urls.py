from django.urls import path
from .views import car_loan_view, savings_view

urlpatterns = [
    path('car_loan/', car_loan_view, name='car_loan'),
    path('savings/', savings_view, name='savings'),
]