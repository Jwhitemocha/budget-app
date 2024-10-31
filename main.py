def calculate_car_loan(principal, annual_rate, years):
    """Calculate monthly car loan payment."""
    monthly_rate = annual_rate / 12 / 100  # Convert annual rate to monthly and to decimal
    months = years * 12
    payment = principal * monthly_rate / (1 - (1 + monthly_rate) ** -months)
    return round(payment, 2)


def calculate_debt_payoff(principal, monthly_payment, annual_rate):
    """Calculate time to pay off debt given a monthly payment."""
    monthly_rate = annual_rate / 12 / 100
    months = 0
    balance = principal
    while balance > 0:
        interest = balance * monthly_rate
        balance += interest - monthly_payment
        months += 1
        if balance <= 0:
            break
    years = months // 12
    months = months % 12
    return years, months


def calculate_savings(income, expenses):
    """Calculate remaining amount after expenses."""
    remaining = income - expenses
    return round(remaining, 2)


# Example usage
if __name__ == "__main__":
    # Car loan example
    car_payment = calculate_car_loan(36000, 8.5, 5)
    print(f"Monthly car loan payment: ${car_payment}")

    # Debt payoff example
    years, months = calculate_debt_payoff(5000, 150, 5.0)
    print(f"Debt payoff time: {years} years and {months} months")
    
    # Savings example
    monthly_income = 4000  # Example monthly income
    monthly_expenses = 2800  # Example monthly expenses
    remaining_savings = calculate_savings(monthly_income, monthly_expenses)
    print(f"Remaining savings after expenses: ${remaining_savings}")
