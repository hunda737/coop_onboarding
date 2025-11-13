import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AccountFlowSettings } from "@/features/account-flow-settings/accountFlowSettingsApiSlice";
import { CellAction } from "./cell-actions";

const getPriorityBadgeColor = (priority: number): string => {
  if (priority > 500) return "destructive";
  if (priority >= 100) return "default";
  return "secondary";
};

export const flowSettingsColumns: ColumnDef<AccountFlowSettings>[] = [
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
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Priority
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as number;
      return (
        <Badge variant={getPriorityBadgeColor(priority) as "default" | "destructive" | "outline" | "secondary"} className="font-mono">
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "active",
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
      const isActive = row.getValue("active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "accountOrigin",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Account Origin
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const origin = row.getValue("accountOrigin") as string | null;
      const matchAll = row.original.matchAllOrigins;

      if (matchAll || !origin) {
        return <Badge variant="outline">ALL</Badge>;
      }

      return <Badge variant="secondary">{origin}</Badge>;
    },
  },
  {
    accessorKey: "documentStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Document Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const document = row.getValue("documentStatus") as string | null;
      const matchAll = row.original.matchAllDocuments;

      if (matchAll || !document) {
        return <Badge variant="outline">ALL</Badge>;
      }

      return <Badge variant="secondary">{document}</Badge>;
    },
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
      const customerType = row.getValue("customerType") as string | null;
      const matchAll = row.original.matchAllCustomerTypes;

      if (matchAll || !customerType) {
        return <Badge variant="outline">ALL</Badge>;
      }

      return <Badge variant="secondary">{customerType}</Badge>;
    },
  },
  {
    accessorKey: "targetStage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Target Stage
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const stage = row.getValue("targetStage") as string;
      const variant = stage === "APPROVED" ? "default" : "secondary";

      return <Badge variant={variant}>{stage}</Badge>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[200px] truncate" title={description}>
          {description || "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

