import React, { useState } from "react";
import BudgetingApp from "./BudgetingApp"; // Import BudgetingApp component
import DebtCalculator from "./DebtCalculator"; // Import DebtCalculator component
import { Container, Box, Tabs, Tab } from "@mui/material";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ width: "20%", borderRight: 1, borderColor: "divider" }}>
          <Tabs
            orientation="vertical"
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="Main tabs"
          >
            <Tab label="Budgeting App" />
            <Tab label="Debt Calculator" />
          </Tabs>
        </Box>
        <Box sx={{ width: "80%", padding: "1rem" }}>
          {selectedTab === 0 && <BudgetingApp />}
          {selectedTab === 1 && <DebtCalculator />}
        </Box>
      </Box>
    </Container>
  );
}

export default App;
