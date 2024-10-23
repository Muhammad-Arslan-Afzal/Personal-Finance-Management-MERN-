import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import apiRequest from "../lib/apiRequest";

// Register necessary Chart.js components
Chart.register(...registerables);

// Define the type for each savings entry
interface SavingsEntry {
  month: string;
  currency: string;
  savings: number;
}

const Savings = () => {
  const [savingsData, setSavingsData] = useState<SavingsEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchSavings = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await apiRequest.get(`/saving/${selectedYear}`);
        setSavingsData(response.data); // Set the savings data from the API
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchSavings();
  }, [selectedYear]);

  // Define months in order for sorting
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Sort savings data based on the month order
  const sortedSavingsData = savingsData.sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );

  // Map data for the chart
  const chartLabels = [...new Set(sortedSavingsData.map((data) => data.month))]; // Get unique month names
  const euroSavings = chartLabels.map((month) => {
    const savingsForEuro = sortedSavingsData.find(
      (data) => data.month === month && data.currency === "€"
    );
    return savingsForEuro ? savingsForEuro.savings : 0;
  });
  const dollarSavings = chartLabels.map((month) => {
    const savingsForDollar = sortedSavingsData.find(
      (data) => data.month === month && data.currency === "$"
    );
    return savingsForDollar ? savingsForDollar.savings : 0;
  });

  // Chart.js data structure for multiple bars (euro & dollar)
  const chartData = {
    labels: chartLabels, // Use sorted month names as labels
    datasets: [
      {
        label: "Savings (Euro)",
        data: euroSavings,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Savings (Dollar)",
        data: dollarSavings,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Savings Amount",
        },
      },
    },
  };

  // Generate a range of years for the dropdown (e.g., 2020 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2019 + 1 },
    (_, i) => currentYear - i
  ); // Adjust the start year as needed

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="year-select-label" shrink>
          Select Year
        </InputLabel>
        <Select
          labelId="year-select-label"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          label="Select Year"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
        <Box
          sx={{
            width: "100%",
            display: "table",
            tableLayout: "fixed",
            height: "350px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <CircularProgress /> // Display CircularProgress while loading
          ) : savingsData.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <Typography variant="h6" align="center">
              No savings data available for the selected year.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Savings;
