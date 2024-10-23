import React from "react";
import { Bar } from "react-chartjs-2";

interface IncomeData {
  monthName: string;
  totalAmount: number;
  currency: string;
}

interface IncomeChartProps {
  incomeSummary: IncomeData[];
}

const IncomeChart: React.FC<IncomeChartProps> = ({ incomeSummary }) => {
  // Group data by month and currency
  const groupedData: { [key: string]: { [key: string]: number } } = {};

  incomeSummary.forEach((item) => {
    if (!groupedData[item.monthName]) {
      groupedData[item.monthName] = {};
    }
    groupedData[item.monthName][item.currency] = item.totalAmount;
  });

  const labels = Object.keys(groupedData);
  const currencies = Array.from(
    new Set(incomeSummary.map((item) => item.currency))
  );

  // Define colors for each currency
  const currencyColors: { [key: string]: string } = {
    "€": "rgba(54, 162, 235, 0.6)",
    $: "rgba(255, 99, 132, 0.6)",
  };

  const datasets = currencies.map((currency) => ({
    label: currency === "$" ? "Savings (Dollar)" : "Savings (Euro)",
    data: labels.map((month) => groupedData[month][currency] || 0),
    backgroundColor: currencyColors[currency] || "rgba(0, 0, 0, 0.6)",
  }));

  const data = {
    labels,
    datasets,
  };

  // Explicit typing for the options object
  const options: any = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Income Record",
        font: {
          size: 13,
        },
      },
      legend: {
        display: true,
        position: "top" as const, // Cast "top" as a valid position
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default IncomeChart;
