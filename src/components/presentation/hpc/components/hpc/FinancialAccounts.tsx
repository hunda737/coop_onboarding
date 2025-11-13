import { financialAccounts } from "./financialAccountsData";

export const FinancialAccounts = () => {
  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold text-gray-600 mb-2">
        Financial Accounts ({financialAccounts.length})
      </h3>
      <div className="overflow-x-auto border rounded-md h-[24rem] overflow-y-scroll custom-scrollbar">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">ID</th>
              <th className="px-4 py-2 whitespace-nowrap">Account Name</th>
              <th className="px-4 py-2 whitespace-nowrap">Account Type</th>
              <th className="px-4 py-2 whitespace-nowrap">Balance</th>
              <th className="px-4 py-2 whitespace-nowrap">Currency</th>
              <th className="px-4 py-2 whitespace-nowrap">Created On</th>
              <th className="px-4 py-2 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {financialAccounts.map((account, index) => (
              <tr
                key={account.accountId}
                className={`h-8 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  {account.accountId}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {account.accountName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {account.accountType}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {account.balance.toLocaleString(undefined, {
                    style: "currency",
                    currency: account.currency,
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {account.currency}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(account.createdAt).toISOString().split("T")[0]}
                </td>
                <td
                  className={`px-4 py-2 whitespace-nowrap ${
                    account.status === "Active"
                      ? "text-green-500"
                      : account.status === "Inactive"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {account.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
