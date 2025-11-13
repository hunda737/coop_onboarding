import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { loans } from "./loansData"; // Importing the dummy data

export const LoansTable = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold text-gray-600 mb-2">
        Loans ({loans.length})
      </h3>
      <div className="overflow-x-auto border rounded-md  h-[24rem] overflow-y-scroll custom-scrollbar">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2 whitespace-nowrap">Borrower Name</th>
              <th className="px-4 py-2 whitespace-nowrap">Loan Type</th>
              <th className="px-4 py-2 whitespace-nowrap">Principal Amount</th>
              <th className="px-4 py-2 whitespace-nowrap">Rate (%)</th>
              <th className="px-4 py-2 whitespace-nowrap">Remaining</th>
              <th className="px-4 py-2 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <React.Fragment key={index}>
                <tr
                  className={`h-8 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => toggleExpand(index)}
                      className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {expandedRow === index ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {loan.borrowerName}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {loan.loanType}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    ${loan.principalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {loan.interestRate}%
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    ${loan.remainingBalance.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{loan.status}</td>
                </tr>
                {expandedRow === index && (
                  <tr className="bg-gray-50">
                    <td
                      colSpan={9}
                      className="px-4 py-2 text-sm text-gray-600 bg-gray-100"
                    >
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold">Collateral:</span>{" "}
                          {loan.collateral || "None"}
                        </p>
                        <p>
                          <span className="font-semibold">Loan Officer:</span>{" "}
                          {loan.loanOfficer || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Start Date:</span>{" "}
                          {loan.startDate}
                        </p>
                        <p>
                          <span className="font-semibold">Due Date:</span>{" "}
                          {loan.dueDate}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
