import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Harmonization } from "@/features/harmonization/harmonizationApiSlice";
import { format } from "date-fns";
import { HarmonizationCellAction } from "./cell-actions";

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
  switch (status) {
    case "OTP_VERIFIED":
      return "default"; // Green/success
    case "MERGED":
      return "default"; // Green/success
    case "PENDING_OTP":
      return "secondary"; // Yellow/warning
    case "PENDING_KYC_REVIEW":
      return "secondary"; // Yellow/warning
    case "FAYDA_DATA_RECEIVED":
      return "outline"; // Blue/info
    case "REJECTED":
      return "secondary"; // Red/error
    case "CANCELLED":
      return "outline"; // Gray
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "PENDING_OTP":
      return "Pending OTP";
    case "OTP_VERIFIED":
      return "OTP Verified";
    case "FAYDA_DATA_RECEIVED":
      return "Fayda Data Received";
    case "PENDING_KYC_REVIEW":
      return "Pending KYC Review";
    case "MERGED":
      return "Merged";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

export const harmonizationColumns: ColumnDef<Harmonization>[] = [
  {
    id: "accountTitle",
    accessorFn: (row) => row.accountData?.accountTitle || "",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const accountTitle = row.original.accountData?.accountTitle || "N/A";
      return <div className="font-medium">{accountTitle}</div>;
    },
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
    cell: ({ row }) => {
      const accountNumber = row.getValue("accountNumber") as string;
      return <div>{accountNumber}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Phone Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phoneNumber") as string;
      return <div>{phoneNumber}</div>;
    },
  },
  {
    id: "gender",
    accessorFn: (row) => row.accountData?.gender || "",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Gender
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const gender = row.original.accountData?.gender || "N/A";
      return <div className="capitalize">{gender.toLowerCase()}</div>;
    },
  },
  {
    id: "openingDate",
    accessorFn: (row) => row.accountData?.openingDate || "",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Opening Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const openingDate = row.original.accountData?.openingDate;
      if (!openingDate) return <div>N/A</div>;
      try {
        return <div>{format(new Date(openingDate), "MMM dd, yyyy")}</div>;
      } catch {
        return <div>{openingDate}</div>;
      }
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusBadgeVariant(status)}>
          {getStatusLabel(status)}
        </Badge>
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
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      try {
        return <div>{format(new Date(createdAt), "MMM dd, yyyy HH:mm")}</div>;
      } catch {
        return <div>{createdAt}</div>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <HarmonizationCellAction data={row.original} />,
  },
];

