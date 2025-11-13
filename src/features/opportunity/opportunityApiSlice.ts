export type Opportunity = {
  id: string;
  leadId: string;
  customerId: string;
  product: string;
  value: number;
  stage: "Prospecting" | "Negotiation" | "Won" | "Lost";
  probability: number;
  expectedCloseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  assignedTo?: string;
};

// Dummy data
export const opportunities: Opportunity[] = [
  {
    id: "opp-001",
    leadId: "lead-001",
    customerId: "cust-001",
    product: "Premium Savings Account",
    value: 10000,
    stage: "Prospecting",
    probability: 50,
    expectedCloseDate: new Date("2024-12-15"),
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-10"),
    notes: "Customer expressed interest in premium benefits.",
    assignedTo: "John Doe",
  },
  {
    id: "opp-002",
    leadId: "lead-002",
    customerId: "cust-002",
    product: "Corporate Loan",
    value: 250000,
    stage: "Negotiation",
    probability: 70,
    expectedCloseDate: new Date("2025-01-20"),
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-11-15"),
    notes: "Awaiting approval from finance team.",
    assignedTo: "Jane Smith",
  },
  {
    id: "opp-003",
    leadId: "lead-003",
    customerId: "cust-003",
    product: "Wealth Management Service",
    value: 50000,
    stage: "Won",
    probability: 100,
    expectedCloseDate: new Date("2024-11-20"),
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-21"),
    notes: "Contract signed and onboarding scheduled.",
    assignedTo: "Emily Johnson",
  },
  {
    id: "opp-004",
    leadId: "lead-004",
    customerId: "cust-004",
    product: "Mortgage Loan",
    value: 150000,
    stage: "Lost",
    probability: 0,
    expectedCloseDate: new Date("2024-12-01"),
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-10-10"),
    notes: "Customer decided to go with another provider.",
    assignedTo: "Mike Brown",
  },
  {
    id: "opp-005",
    leadId: "lead-005",
    customerId: "cust-005",
    product: "Personal Loan",
    value: 20000,
    stage: "Prospecting",
    probability: 40,
    expectedCloseDate: new Date("2024-12-31"),
    createdAt: new Date("2024-11-05"),
    updatedAt: new Date("2024-11-20"),
    notes:
      "Customer interested but needs more clarification on interest rates.",
    assignedTo: "Sarah Wilson",
  },
];
