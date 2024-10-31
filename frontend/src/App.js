// src/App.js
import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Card, CardContent } from "@mui/material";

function App() {
  const [principal, setPrincipal] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");
  const [payment, setPayment] = useState(null);

  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState(null);

  const calculateCarLoan = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/car_loan/", {
        principal: parseFloat(principal),
        annual_rate: parseFloat(annualRate),
        years: parseInt(years),
      });
      setPayment(response.data.payment);
    } catch (error) {
      console.error("Error calculating car loan:", error);
    }
  };

  const calculateSavings = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/savings/", {
        income: parseFloat(income),
        expenses: parseFloat(expenses),
      });
      setSavings(response.data.remaining_savings);
    } catch (error) {
      console.error("Error calculating savings:", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ padding: "2rem" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Budgeting App
      </Typography>

      <Card style={{ marginBottom: "1.5rem" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Car Loan Calculator</Typography>
          <TextField
            label="Principal"
            variant="outlined"
            fullWidth
            margin="normal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
          <TextField
            label="Annual Rate (%)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
          />
          <TextField
            label="Years"
            variant="outlined"
            fullWidth
            margin="normal"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={calculateCarLoan} style={{ marginTop: "1rem" }}>
            Calculate Car Loan Payment
          </Button>
          {payment !== null && <Typography style={{ marginTop: "1rem" }}>Monthly Payment: ${payment}</Typography>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Savings Calculator</Typography>
          <TextField
            label="Monthly Income"
            variant="outlined"
            fullWidth
            margin="normal"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
          <TextField
            label="Monthly Expenses"
            variant="outlined"
            fullWidth
            margin="normal"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
          />
          <Button variant="contained" color="primary" fullWidth onClick={calculateSavings} style={{ marginTop: "1rem" }}>
            Calculate Remaining Savings
          </Button>
          {savings !== null && <Typography style={{ marginTop: "1rem" }}>Remaining Savings: ${savings}</Typography>}
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;

