import { useState } from "react";
import { CustomerExperience } from "./CustomerExperience";
import { FinancialAccounts } from "./FinancialAccounts";
import { LoansTable } from "./Loans";
import { TransactionTable } from "./Transactions";

export const MainTabs = () => {
  const [activeTab, setActiveTab] = useState("customer-interactions");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li>
            <button
              onClick={() => handleTabClick("customer-interactions")}
              className={`inline-block p-2 border-b-2 rounded-t-lg ${
                activeTab === "customer-interactions"
                  ? "text-cyan-500 border-cyan-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Customer Interactions
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick("financial-accounts")}
              className={`inline-block p-2 border-b-2 rounded-t-lg ${
                activeTab === "financial-accounts"
                  ? "text-cyan-500 border-cyan-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Financial Accounts
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick("loans")}
              className={`inline-block p-2 border-b-2 rounded-t-lg ${
                activeTab === "loans"
                  ? "text-cyan-500 border-cyan-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Loans
            </button>
          </li>
          <li>
            <button
              onClick={() => handleTabClick("transaction-pad")}
              className={`inline-block p-2 border-b-2 rounded-t-lg ${
                activeTab === "transaction-pad"
                  ? "text-cyan-500 border-cyan-500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              Transaction History
            </button>
          </li>
        </ul>
      </div>

      <div>
        {activeTab === "customer-interactions" && <CustomerExperience />}
        {activeTab === "financial-accounts" && <FinancialAccounts />}
        {activeTab === "transaction-pad" && <TransactionTable />}
        {activeTab === "loans" && <LoansTable />}
      </div>
    </div>
  );
};
