interface FinancialAccount {
  accountId: number;
  accountName: string;
  accountType: "Savings" | "Current" | "Loan" | "Credit" | "Fixed Deposit";
  balance: number;
  currency: string;
  createdAt: string;
  status: "Active" | "Inactive" | "Closed";
}

export const financialAccounts: FinancialAccount[] = [
  {
    accountId: 1,
    accountName: "Yared Mesele Savings",
    accountType: "Savings",
    balance: 5000.25,
    currency: "USD",
    createdAt: "2021-05-10",
    status: "Active",
  },
  {
    accountId: 2,
    accountName: "Yared Mesele Current",
    accountType: "Current",
    balance: 15000.0,
    currency: "USD",
    createdAt: "2021-03-15",
    status: "Active",
  },
  {
    accountId: 3,
    accountName: "Home Loan",
    accountType: "Loan",
    balance: -250000.0,
    currency: "USD",
    createdAt: "2020-11-01",
    status: "Active",
  },
  {
    accountId: 4,
    accountName: "Platinum Credit Card",
    accountType: "Credit",
    balance: -3500.75,
    currency: "USD",
    createdAt: "2022-02-01",
    status: "Active",
  },
  {
    accountId: 5,
    accountName: "Fixed Deposit 2025",
    accountType: "Fixed Deposit",
    balance: 50000.0,
    currency: "USD",
    createdAt: "2023-01-10",
    status: "Active",
  },
  {
    accountId: 6,
    accountName: "Gutema Fite Savings",
    accountType: "Savings",
    balance: 8000.75,
    currency: "EUR",
    createdAt: "2021-07-25",
    status: "Inactive",
  },
  {
    accountId: 7,
    accountName: "Business Current Account",
    accountType: "Current",
    balance: 25000.5,
    currency: "GBP",
    createdAt: "2020-08-18",
    status: "Active",
  },
  {
    accountId: 8,
    accountName: "Vehicle Loan",
    accountType: "Loan",
    balance: -50000.0,
    currency: "USD",
    createdAt: "2019-12-05",
    status: "Closed",
  },
  {
    accountId: 9,
    accountName: "Gold Credit Card",
    accountType: "Credit",
    balance: -1200.3,
    currency: "USD",
    createdAt: "2023-03-30",
    status: "Active",
  },
  {
    accountId: 10,
    accountName: "Future Fixed Deposit",
    accountType: "Fixed Deposit",
    balance: 30000.0,
    currency: "EUR",
    createdAt: "2024-01-15",
    status: "Active",
  },
];
