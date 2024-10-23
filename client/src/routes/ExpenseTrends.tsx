import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartOptions } from "chart.js";
import { Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import apiRequest from "../lib/apiRequest";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the types for the chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
    fill: boolean;
  }[];
}

const ExpenseTrends: React.FC = () => {
  const [chartData, setChartData] = React.useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: "EURO",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: false,
      },
      {
        label: "DOLLAR",
        data: [],
        borderColor: "rgb(153, 102, 255)",
        tension: 0.1,
        fill: false,
      },
    ],
  });
  const [selectedYear, setSelectedYear] = React.useState<number>(
    new Date().getFullYear()
  );

  React.useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await apiRequest.get("/expense/"); // Adjust the URL according to your API endpoint
        const expenses = response.data;

        // Initialize an object to hold total amounts grouped by month and currency
        const expenseTotals: {
          [key: string]: { euro: number; dollar: number };
        } = {};

        // Loop through each expense entry
        expenses.forEach((expense: any) => {
          const dateSpent = new Date(expense.dateSpent); // Parse dateSpent
          const month = dateSpent.toLocaleString("default", {
            month: "long",
          }); // Get month name
          const year = dateSpent.getFullYear(); // Get year

          // Check if the expense entry's year matches the selected year
          if (year === selectedYear) {
            // Initialize the month entry if it doesn't exist
            if (!expenseTotals[month]) {
              expenseTotals[month] = { euro: 0, dollar: 0 };
            }

            // Sum the expense amounts based on currency
            if (expense.currency === "$") {
              expenseTotals[month].dollar += expense.amount;
            } else if (expense.currency === "€") {
              expenseTotals[month].euro += expense.amount;
            }
          }
        });

        // Prepare the data for the chart
        const sortedMonths = Object.keys(expenseTotals).sort(
          (a, b) => new Date(a + " 1").getTime() - new Date(b + " 1").getTime()
        );

        const euroData = sortedMonths.map((month) => expenseTotals[month].euro);
        const dollarData = sortedMonths.map(
          (month) => expenseTotals[month].dollar
        );

        // Update the chart data state
        setChartData({
          labels: sortedMonths,
          datasets: [
            {
              label: "EURO",
              data: euroData,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
              fill: false,
            },
            {
              label: "DOLLAR",
              data: dollarData,
              borderColor: "rgb(153, 102, 255)",
              tension: 0.1,
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchExpenses();
  }, [selectedYear]); // Re-fetch data when the selected year changes

  // Correctly typed chart options using ChartOptions type
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: `Expense Trends for ${selectedYear}`,
      },
    },
  };

  // Generate a range of years for the dropdown (e.g., 2018 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 },
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
      <Box
        sx={{
          width: "100%",
          display: "table",
          tableLayout: "fixed",
          height: "350px",
        }}
      >
        <Line data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default ExpenseTrends;
