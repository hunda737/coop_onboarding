import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { accountType, statuses } from "@/components/ui/data/data";
import { Account, IndividualAccount, JointAccount, OrganizationalAccount } from "@/features/accounts/accountApiSlice";
import { format } from "date-fns";

// Filter only accounts with status "INITIAL"
export const prospectiveColumns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        disabled={row.original.status === "success" || row.original.status === "inprogress"}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.customerId || "N/A",
  },
  {
    accessorKey: "accountNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Account Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.accountNumber || "N/A",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const account = row.original;
      switch (account.customerType) {
        case "INDIVIDUAL":
          return (account as IndividualAccount).fullName || "N/A";
        case "JOINT":
          const jointAccount = account as JointAccount;
          return jointAccount.customersInfo?.map(c => c.fullName).join(" & ") || "N/A";
        case "ORGANIZATION":
          const orgAccount = account as OrganizationalAccount;
          return orgAccount.companyName?.trim() || "N/A";
        default:
          return "N/A";
      }
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contact
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const account = row.original;
      switch (account.customerType) {
        case "INDIVIDUAL":
          return (account as IndividualAccount).phone || "N/A";
        case "JOINT":
          const jointAccount = account as JointAccount;
          return jointAccount.customersInfo?.[0]?.phone || "N/A";
        case "ORGANIZATION":
          const orgAccount = account as OrganizationalAccount;
          return orgAccount.companyPhoneNumber?.trim() || "N/A";
        default:
          return "N/A";
      }
    },
  },
  {
    accessorKey: "branch",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Branch
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.branch || "N/A",
  },
  {
    accessorKey: "accountType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Account Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const accountTypeValue = row.getValue("accountType");
      const status = accountType.find((status) => status.value === accountTypeValue);
      if (!status) return null;

      return (
        <div className={`flex items-center whitespace-nowrap`} style={{ color: status.color }}>
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "customerType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Customer Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const customerType = row.getValue("customerType");
      let displayText = "";
      let color = "";

      switch (customerType) {
        case "INDIVIDUAL":
          displayText = "Individual";
          color = "#3b82f6";
          break;
        case "JOINT":
          displayText = "Joint";
          color = "#10b981";
          break;
        case "ORGANIZATION":
          displayText = "Organizational";
          color = "#f59e0b";
          break;
        default:
          displayText = "Unknown";
      }

      return (
        <div className="flex items-center whitespace-nowrap" style={{ color }}>
          <span>{displayText}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "status",
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status || row.getValue("status") === "INITIAL") return null;

      return (
        <div className={`flex w-[100px] items-center`} style={{ color: status.color }}>
          {status.icon && <status.icon className="mr-2 h-4 w-4" />}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>
        {row.original.createdAt ? format(new Date(row.original.createdAt), "MM/dd/yyyy") : "N/A"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];