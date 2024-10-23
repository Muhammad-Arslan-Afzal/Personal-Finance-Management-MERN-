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

// Chart data and options
const IncomeTrends: React.FC = () => {
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
    const fetchIncomes = async () => {
      try {
        const response = await apiRequest.get("/income/"); // Adjust the URL according to your API endpoint
        const incomes = response.data;

        // Initialize an object to hold total amounts grouped by month and currency
        const incomeTotals: {
          [key: string]: { euro: number; dollar: number };
        } = {};

        // Loop through each income entry
        incomes.forEach((income: any) => {
          const dateReceived = new Date(income.dateReceived); // Parse dateReceived
          const month = dateReceived.toLocaleString("default", {
            month: "long",
          }); // Get month name
          const year = dateReceived.getFullYear(); // Get year

          // Check if the income entry's year matches the selected year
          if (year === selectedYear) {
            // Initialize the month entry if it doesn't exist
            if (!incomeTotals[month]) {
              incomeTotals[month] = { euro: 0, dollar: 0 };
            }

            // Sum the income amounts based on currency
            if (income.currency === "$") {
              incomeTotals[month].dollar += income.amount;
            } else if (income.currency === "€") {
              incomeTotals[month].euro += income.amount;
            }
          }
        });

        // Prepare the data for the chart
        const sortedMonths = Object.keys(incomeTotals).sort(
          (a, b) => new Date(a + " 1").getTime() - new Date(b + " 1").getTime()
        );

        const euroData = sortedMonths.map((month) => incomeTotals[month].euro);
        const dollarData = sortedMonths.map(
          (month) => incomeTotals[month].dollar
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

    fetchIncomes();
  }, [selectedYear]); // Re-fetch data when the selected year changes

  // Correctly typed chart options using ChartOptions type
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false, // This ensures it doesn't shrink the chart
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: `Income Trends for ${selectedYear}`,
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

export default IncomeTrends;
