import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Card, InputAdornment, Box, Grid } from "@mui/material";
import axios from "axios";

function DebtCalculator() {
  const [debts, setDebts] = useState([]);
  const [extraPayment, setExtraPayment] = useState("");
  const [debtReport, setDebtReport] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [totalMonthlyMinimumPayments, setTotalMonthlyMinimumPayments] = useState(0);

  useEffect(() => {
    fetchSavedPlans();
  }, []);

  const addDebt = () => {
    setDebts([...debts, { name: "", interestRate: "", minPayment: "", startBalance: "", currentBalance: "", dueDate: "" }]);
  };

  const handleDebtChange = (index, field, value) => {
    const updatedDebts = debts.map((debt, i) => (i === index ? { ...debt, [field]: value } : debt));
    setDebts(updatedDebts);

    const updatedTotalMonthlyMinimum = updatedDebts.reduce((sum, debt) => sum + parseFloat(debt.minPayment || 0), 0);
    setTotalMonthlyMinimumPayments(updatedTotalMonthlyMinimum);
  };

  const calculateDebtPlan = () => {
    let remainingDebts = debts.map(debt => ({
      ...debt,
      interest: (parseFloat(debt.interestRate) / 100 / 12) * parseFloat(debt.currentBalance || 0),  // Ensures numeric values
      monthsToPayoff: 0,
      progress: 0,
    })).sort((a, b) => parseFloat(a.currentBalance) - parseFloat(b.currentBalance));
  
    let totalExtra = parseFloat(extraPayment);
    let rollingMinimumPayment = 0;
    let monthlyReport = [];
  
    monthlyReport.push(`Following the snowball method, start paying off ${remainingDebts[0].name} first.`);
    monthlyReport.push(`Apply your minimum payments to all debts and contribute your $${totalExtra.toFixed(2)} extra to ${remainingDebts[0].name}.`);
  
    let month = 1;
    while (remainingDebts.length > 0) {
      monthlyReport.push(`\nMonth ${month} Status Update:`);
      monthlyReport.push(`Apply a total of $${totalMonthlyMinimumPayments.toFixed(2)} to minimum payments on all debts.`);
      monthlyReport.push(`Apply an additional $${totalExtra.toFixed(2)} to ${remainingDebts[0].name}.`);
  
      remainingDebts = remainingDebts.filter(debt => parseFloat(debt.currentBalance) > 0);
  
      remainingDebts.forEach((debt, index) => {
        let payment = parseFloat(debt.minPayment) + rollingMinimumPayment;
        if (index === 0 && totalExtra > 0) {
          payment += totalExtra;
        }
        debt.currentBalance -= payment - debt.interest;
        debt.progress = ((parseFloat(debt.startBalance) - parseFloat(debt.currentBalance)) / parseFloat(debt.startBalance)) * 100;
        debt.monthsToPayoff += 1;
  
        if (debt.currentBalance <= 0) {
          debt.currentBalance = 0;
          rollingMinimumPayment += parseFloat(debt.minPayment);
          monthlyReport.push(`  ${debt.name} is paid off!`);
          monthlyReport.push(`  Rolling minimum payment for next debt: $${rollingMinimumPayment.toFixed(2)}`);
        } else {
          monthlyReport.push(`  ${debt.name} balance = $${debt.currentBalance.toFixed(2)}`);
        }
      });
  
      month++;
    }
  
    monthlyReport.push(`\nAt this pace, you'll be debt-free in ${month - 1} months!`);
    setDebtReport(monthlyReport);
  
    // Prepare data to save
    const planData = {
      total_extra_payment: parseFloat(extraPayment),
      total_months: month - 1,
      plan_summary: monthlyReport.join("\n"),
      debts: debts.map(debt => ({
        name: debt.name,
        interest_rate: parseFloat(debt.interestRate),
        min_payment: parseFloat(debt.minPayment),
        start_balance: parseFloat(debt.startBalance),
        current_balance: parseFloat(debt.currentBalance),
        due_date: debt.dueDate || null  // Handle empty due_date as null
      }))
    };
  
    // Send to backend
    axios.post("http://127.0.0.1:8000/api/payoff-plans/save_plan/", planData)
      .then(() => fetchSavedPlans())
      .catch(error => console.error("Error saving payoff plan:", error));
  };
  

  const fetchSavedPlans = () => {
    axios.get("http://127.0.0.1:8000/api/payoff-plans/list_plans/")
      .then(response => setSavedPlans(response.data))
      .catch(error => console.error("Error fetching saved plans:", error));
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div>
      <Typography variant="h5" style={{ marginTop: "1.5rem" }}>Debt Calculator</Typography>
      <Button variant="contained" color="primary" onClick={addDebt} style={{ margin: "1rem 0" }}>Add Debt</Button>

      {debts.map((debt, index) => (
        <Card key={index} style={{ padding: "1rem", marginBottom: "1rem" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Debt Name"
                value={debt.name}
                onChange={(e) => handleDebtChange(index, "name", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Interest Rate (%)"
                value={debt.interestRate}
                onChange={(e) => handleDebtChange(index, "interestRate", e.target.value)}
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Minimum Payment"
                value={debt.minPayment}
                onChange={(e) => handleDebtChange(index, "minPayment", e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Starting Balance"
                value={debt.startBalance}
                onChange={(e) => handleDebtChange(index, "startBalance", e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Current Balance"
                value={debt.currentBalance}
                onChange={(e) => handleDebtChange(index, "currentBalance", e.target.value)}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>
      ))}

      <Box mt={2}>
        <TextField
          label="Extra Monthly Contribution"
          value={extraPayment}
          onChange={(e) => setExtraPayment(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          fullWidth
        />
      </Box>

      <Box mt={2}>
        <Button variant="contained" color="secondary" onClick={calculateDebtPlan}>Calculate Debt Plan</Button>
      </Box>

      <Box mt={3}>
        <Typography variant="h6">Debt Payoff Plan</Typography>
        <Typography variant="body1">Total Monthly Minimum Payments: ${totalMonthlyMinimumPayments.toFixed(2)}</Typography>
        <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>{debtReport.join("\n")}</Typography>
      </Box>

      <Box mt={3}>
        <Typography variant="h6">Saved Debt Plans</Typography>
        {savedPlans.map(plan => (
          <Card key={plan.id} style={{ margin: "1rem 0", padding: "1rem" }}>
            <Typography variant="body1">Plan Created: {plan.created_at}</Typography>
            <Button variant="outlined" color="primary" onClick={() => handlePlanClick(plan)}>
              View Plan
            </Button>
          </Card>
        ))}
      </Box>

      {selectedPlan && (
        <Card style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6">Selected Debt Plan</Typography>
          <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>{selectedPlan.plan_summary}</Typography>
        </Card>
      )}
    </div>
  );
}

export default DebtCalculator;
