// src/components/Dashboard.tsx
import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Grid from "@mui/material/Grid2";
import apiRequest from "../lib/apiRequest";
import IncomeChart from "./IncomeChart";
import ExpenseChart from "./ExpenseChart";

interface IncomeSummary {
  monthName: string;
  totalAmount: number;
  currency: string; // Added currency field
}

interface ExpenseSummary {
  totalAmount: number;
  monthName: string;
  currency: string; // Keep currency in case it's needed for display
}

interface BalancesByCurrency {
  [currency: string]: number; // Dynamic key-value pairs
}

const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useContext must be used within an AuthContextProvider");
  }
  const { currentUser } = authContext;

  const [incomeSummary, setIncomeSummary] = useState<IncomeSummary[]>([]);
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary[]>([]);
  const [balance, setBalance] = useState<BalancesByCurrency>({}); // Update state type

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest.get("/home");
        const { incomeSummary, expenseSummary, balancesByCurrency } =
          response.data;
        console.log(response.data);
        setIncomeSummary(incomeSummary);
        setExpenseSummary(expenseSummary);
        setBalance(balancesByCurrency); // Set balance to the object
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h3">
          {currentUser ? `Welcome, ${currentUser.name}` : "Welcome!"}
        </Typography>
        <Typography variant="subtitle1">
          We are happy to have you onboard!
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Balance
        </Typography>
        {Object.entries(balance).map(([currency, amount], index) => (
          <Typography key={currency}>
            {amount.toFixed(2)} {currency}
            {index < Object.entries(balance).length - 1 ? " " : ""}
          </Typography>
        ))}
      </Box>

      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "350px", // Set a fixed height for charts
                p: 2,
              }}
            >
              <IncomeChart incomeSummary={incomeSummary} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "350px", // Set the same fixed height
                p: 2,
              }}
            >
              <ExpenseChart expenseSummary={expenseSummary} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
