// src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [principal, setPrincipal] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");
  const [payment, setPayment] = useState(null);

  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState(null);

  // Function to send car loan data to Django and get the monthly payment
  const calculateCarLoan = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/car_loan/", {
        principal: parseFloat(principal),
        annual_rate: parseFloat(annualRate),
        years: parseInt(years),
      });
      setPayment(response.data.payment); // Update payment state with response
    } catch (error) {
      console.error("Error calculating car loan:", error);
    }
  };

  // Function to send savings data to Django and get remaining savings
  const calculateSavings = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/savings/", {
        income: parseFloat(income),
        expenses: parseFloat(expenses),
      });
      setSavings(response.data.remaining_savings); // Update savings state with response
    } catch (error) {
      console.error("Error calculating savings:", error);
    }
  };

  return (
    <div className="App">
      <h1>Budgeting App</h1>

      <div>
        <h2>Car Loan Calculator</h2>
        <input
          type="number"
          placeholder="Principal"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Annual Rate"
          value={annualRate}
          onChange={(e) => setAnnualRate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <button onClick={calculateCarLoan}>Calculate Car Loan Payment</button>
        {payment !== null && <p>Monthly Payment: ${payment}</p>}
      </div>

      <div>
        <h2>Savings Calculator</h2>
        <input
          type="number"
          placeholder="Monthly Income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monthly Expenses"
          value={expenses}
          onChange={(e) => setExpenses(e.target.value)}
        />
        <button onClick={calculateSavings}>Calculate Remaining Savings</button>
        {savings !== null && <p>Remaining Savings: ${savings}</p>}
      </div>
    </div>
  );
}

export default App;

