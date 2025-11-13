export interface Loan {
  loanId: string;
  borrowerName: string;
  loanType: string;
  principalAmount: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
  remainingBalance: number;
  status: "Active" | "Closed" | "Defaulted";
  collateral?: string;
  loanOfficer?: string;
}
export const loans: Loan[] = [
  {
    loanId: "LN001",
    borrowerName: "John Doe",
    loanType: "Personal",
    principalAmount: 15000,
    interestRate: 5.5,
    startDate: "2024-01-15",
    dueDate: "2025-01-15",
    remainingBalance: 10000,
    status: "Active",
    collateral: "None",
    loanOfficer: "Alice Johnson",
  },
  {
    loanId: "LN002",
    borrowerName: "Jane Smith",
    loanType: "Mortgage",
    principalAmount: 250000,
    interestRate: 3.2,
    startDate: "2023-03-01",
    dueDate: "2043-03-01",
    remainingBalance: 230000,
    status: "Active",
    collateral: "House at 123 Main St.",
    loanOfficer: "Bob Brown",
  },
  {
    loanId: "LN003",
    borrowerName: "Acme Corp",
    loanType: "Business",
    principalAmount: 100000,
    interestRate: 6.5,
    startDate: "2022-06-10",
    dueDate: "2027-06-10",
    remainingBalance: 80000,
    status: "Active",
    collateral: "Company Equipment",
    loanOfficer: "Claire Lee",
  },
  {
    loanId: "LN004",
    borrowerName: "Michael Davis",
    loanType: "Auto",
    principalAmount: 20000,
    interestRate: 4.0,
    startDate: "2021-08-01",
    dueDate: "2026-08-01",
    remainingBalance: 8000,
    status: "Active",
    collateral: "Toyota Corolla 2021",
    loanOfficer: "Ethan Clark",
  },
  {
    loanId: "LN005",
    borrowerName: "Anna Wilson",
    loanType: "Personal",
    principalAmount: 5000,
    interestRate: 7.0,
    startDate: "2023-09-15",
    dueDate: "2024-09-15",
    remainingBalance: 0,
    status: "Closed",
    collateral: "None",
    loanOfficer: "Alice Johnson",
  },
  {
    loanId: "LN006",
    borrowerName: "Thomas Anderson",
    loanType: "Mortgage",
    principalAmount: 300000,
    interestRate: 3.8,
    startDate: "2020-05-20",
    dueDate: "2050-05-20",
    remainingBalance: 290000,
    status: "Defaulted",
    collateral: "House at 456 Elm St.",
    loanOfficer: "Bob Brown",
  },
];
