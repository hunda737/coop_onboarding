import { useState } from "react";
import { transactions } from "./transactionData";
import TransactionGraph from "./TransactionGraph";

export const TransactionTable = () => {
  const [activeTab, setActiveTab] = useState<"analysis" | "list">("analysis");

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center border-b">
        {/* Tab Buttons */}
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "analysis"
                ? "border-b-2 border-cyan-500 text-cyan-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("analysis")}
          >
            Analysis
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "list"
                ? "border-b-2 border-cyan-500 text-cyan-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "analysis" && (
          <div>
            <TransactionGraph />
          </div>
        )}

        {activeTab === "list" && (
          <div className="overflow-x-auto border rounded-md h-[21rem] overflow-y-scroll custom-scrollbar">
            <h3 className="text-xs font-semibold text-gray-600 mb-2">
              Transactions ({transactions.length})
            </h3>
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 text-xs text-gray-700">
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">Txn ID</th>
                  <th className="px-4 py-2 whitespace-nowrap">
                    Account Holder
                  </th>
                  <th className="px-4 py-2 whitespace-nowrap">Txn Type</th>
                  <th className="px-4 py-2 whitespace-nowrap">Amount</th>
                  <th className="px-4 py-2 whitespace-nowrap">Txn Date</th>
                  <th className="px-4 py-2 whitespace-nowrap">Reference</th>
                  <th className="px-4 py-2 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`h-8 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-4 py-2 whitespace-nowrap">
                      {transaction.transactionId}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {transaction.accountHolder}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {transaction.transactionType}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {transaction.amount}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {transaction.transactionDate}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {transaction.reference}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {transaction.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
