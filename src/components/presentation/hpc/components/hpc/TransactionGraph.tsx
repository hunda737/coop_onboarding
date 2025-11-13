import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { transactions } from "./transactionData";

// Import the transaction data

// Helper function to process transactions into chart data
const processTransactions = (data: typeof transactions) => {
  const groupedData: Record<
    string,
    { date: string; credit: number; debit: number }
  > = {};

  data.forEach(({ transactionDate, transactionType, amount }) => {
    if (!groupedData[transactionDate]) {
      groupedData[transactionDate] = {
        date: transactionDate,
        credit: 0,
        debit: 0,
      };
    }

    if (transactionType === "Credit") {
      groupedData[transactionDate].credit += amount;
    } else if (transactionType === "Debit") {
      groupedData[transactionDate].debit += amount;
    }
  });

  return Object.values(groupedData); // Convert object to array for chart consumption
};

const TransactionGraph: React.FC = () => {
  // Memoized chart data for performance
  const chartData = useMemo(
    () => processTransactions(transactions),
    [transactions]
  );

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <span className="text-xl text-cyan-500">Transaction Trends</span>
        <span>Visualizing credits and debits over time</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="credit"
            stroke="#EE7B28"
            fill="#EE7B28"
            name="Credit"
          />
          <Area
            type="monotone"
            dataKey="debit"
            stroke="#00ADEF"
            fill="#00ADEF"
            name="Debit"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionGraph;
