import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Tabs, Tab, Typography, Card, CardContent, TextField, Button, Box, Grid } from "@mui/material";

function App() {
  const [budgets, setBudgets] = useState([]);         // Stores all saved budgets
  const [selectedTab, setSelectedTab] = useState(0);  // Tracks selected tab (0 is "Add Budget")
  const [newBudget, setNewBudget] = useState({
    name: "",
    paycheck_amount: "",
    expenses: [{ category: "", amount: "", dueDate: "" }],
  });
  const [financialReport, setFinancialReport] = useState(null); // Stores report data for selected budget

  // Fetch saved budgets from the backend when the component mounts
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/budgets/")
      .then((response) => setBudgets(response.data))
      .catch((error) => console.error("Error fetching budgets:", error));
  }, []);

  // Handle tab change to select a budget or add a new one
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue > 0) {
      generateFinancialReport(budgets[newValue - 1]);
    } else {
      setFinancialReport(null);
    }
  };

  // Handle changes to the new budget form
  const handleNewBudgetChange = (field, value) => {
    setNewBudget({ ...newBudget, [field]: value });
  };

  // Handle changes to expenses in the new budget form
  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = newBudget.expenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    setNewBudget({ ...newBudget, expenses: updatedExpenses });
  };

  // Add an empty expense field
  const addExpenseField = () => {
    setNewBudget({
      ...newBudget,
      expenses: [...newBudget.expenses, { category: "", amount: "", dueDate: "" }],
    });
  };

  // Save new budget to the backend
  const saveNewBudget = () => {
    axios.post("http://127.0.0.1:8000/api/budgets/", {
      name: newBudget.name,
      paycheck_amount: parseFloat(newBudget.paycheck_amount),
      expenses: newBudget.expenses.map((expense) => ({
        category: expense.category,
        amount: parseFloat(expense.amount),
        due_date: parseInt(expense.dueDate),
      })),
    })
    .then((response) => {
      setBudgets([...budgets, response.data]);  // Add new budget to the budget list
      setSelectedTab(budgets.length + 1);       // Select the new budget tab
      setNewBudget({                            // Reset form
        name: "",
        paycheck_amount: "",
        expenses: [{ category: "", amount: "", dueDate: "" }],
      });
    })
    .catch((error) => console.error("Error saving new budget:", error));
  };

  // Generate Financial Report for Selected Budget
  const generateFinancialReport = (budget) => {
    const totalExpenses = budget.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalIncome = parseFloat(budget.paycheck_amount) * 2; // Assuming two paychecks per month
    const totalSavings = totalIncome - totalExpenses;
    const healthGauge = totalExpenses / totalIncome > 0.9 ? "Risky" : "Healthy";

    setFinancialReport({
      totalExpenses,
      totalSavings,
      healthGauge,
    });
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Budgeting App
      </Typography>

      {/* Display budget tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Budget Tabs"
      >
        <Tab label="Add Budget" /> {/* Add Budget Tab */}
        {budgets.map((budget, index) => (
          <Tab label={budget.name} key={budget.id} />
        ))}
      </Tabs>

      {/* Display form to add a new budget */}
      {selectedTab === 0 && (
        <Card style={{ marginTop: "1.5rem", padding: "1rem" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Add a New Budget</Typography>
            <TextField
              label="Budget Name"
              fullWidth
              margin="normal"
              value={newBudget.name}
              onChange={(e) => handleNewBudgetChange("name", e.target.value)}
            />
            <TextField
              label="Paycheck Amount"
              type="number"
              fullWidth
              margin="normal"
              value={newBudget.paycheck_amount}
              onChange={(e) => handleNewBudgetChange("paycheck_amount", e.target.value)}
            />
            <Typography variant="h6" gutterBottom>Expenses</Typography>
            {newBudget.expenses.map((expense, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={4}>
                  <TextField
                    label="Category"
                    fullWidth
                    value={expense.category}
                    onChange={(e) => handleExpenseChange(index, "category", e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    value={expense.amount}
                    onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Due Date"
                    type="number"
                    fullWidth
                    value={expense.dueDate}
                    onChange={(e) => handleExpenseChange(index, "dueDate", e.target.value)}
                  />
                </Grid>
              </Grid>
            ))}
            <Button onClick={addExpenseField} style={{ marginTop: "1rem" }}>Add Another Expense</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={saveNewBudget}
              style={{ marginTop: "1rem", display: "block" }}
            >
              Save Budget
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Display details of the selected budget */}
      {selectedTab > 0 && budgets[selectedTab - 1] && (
        <Card style={{ marginTop: "1.5rem", padding: "1rem" }}>
          <CardContent>
            <Typography variant="h5">{budgets[selectedTab - 1].name}</Typography>
            <Typography variant="body1">Paycheck Amount: ${budgets[selectedTab - 1].paycheck_amount}</Typography>
            <Typography variant="body1">Created At: {budgets[selectedTab - 1].created_at}</Typography>
            <Typography variant="h6" style={{ marginTop: "1rem" }}>Expenses:</Typography>
            {budgets[selectedTab - 1].expenses.length > 0 ? (
              <ul>
                {budgets[selectedTab - 1].expenses.map((expense) => (
                  <li key={expense.id}>
                    {expense.category}: ${expense.amount} (Due Date: {expense.due_date})
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2">No expenses added for this budget.</Typography>
            )}

            {/* Display Financial Report */}
            {financialReport && (
              <Box style={{ marginTop: "1.5rem" }}>
                <Typography variant="h6">Financial Report</Typography>
                <Typography variant="body1">Total Monthly Expenses: ${financialReport.totalExpenses.toFixed(2)}</Typography>
                <Typography variant="body1">Total Monthly Savings: ${financialReport.totalSavings.toFixed(2)}</Typography>
                <Typography variant="body1" style={{ color: financialReport.healthGauge === "Risky" ? "red" : "green" }}>
                  Financial Health: {financialReport.healthGauge}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default App;
