import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { HarmonizationItem } from "@/features/harmonization/harmonizationApiSlice";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const harmonizationColumns: ColumnDef<HarmonizationItem>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.id,
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
    cell: ({ row }) => row.original.phoneNumber || "N/A",
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
      const status = row.original.status;
      const statusColors: Record<string, string> = {
        REJECTED: "destructive",
        APPROVED: "default",
        PENDING: "secondary",
      };
      return (
        <Badge variant={statusColors[status] as any || "outline"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "accountData.accountTitle",
    header: "Account Title",
    cell: ({ row }) => row.original.accountData?.accountTitle || "N/A",
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
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), "MM/dd/yyyy HH:mm")
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span>
        {row.original.updatedAt
          ? format(new Date(row.original.updatedAt), "MM/dd/yyyy HH:mm")
          : "N/A"}
      </span>
    ),
  },
];

