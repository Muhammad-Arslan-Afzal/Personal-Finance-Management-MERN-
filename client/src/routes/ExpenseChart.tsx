// src/components/ExpenseChart.tsx
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
import { Box } from "@mui/material";

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

interface ExpenseChartProps {
  expenseSummary: {
    totalAmount: number;
    monthName: string;
    currency: string;
  }[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenseSummary }) => {
  // Prepare the data for the chart
  const expenseTotals: { [key: string]: { euro: number; dollar: number } } = {};

  expenseSummary.forEach(({ totalAmount, monthName, currency }) => {
    if (!expenseTotals[monthName]) {
      expenseTotals[monthName] = { euro: 0, dollar: 0 };
    }
    if (currency === "$") {
      expenseTotals[monthName].dollar += totalAmount;
    } else if (currency === "€") {
      expenseTotals[monthName].euro += totalAmount;
    }
  });

  // Prepare labels and data for the chart
  const sortedMonths = Object.keys(expenseTotals).sort(
    (a, b) => new Date(a + " 1").getTime() - new Date(b + " 1").getTime()
  );

  const euroData = sortedMonths.map((month) => expenseTotals[month].euro);
  const dollarData = sortedMonths.map((month) => expenseTotals[month].dollar);

  const chartData: ChartData = {
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
  };

  // Chart options
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Expense Trends",
      },
    },
  };

  return (
    <Box>
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

export default ExpenseChart;
