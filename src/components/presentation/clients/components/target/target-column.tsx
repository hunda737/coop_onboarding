import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { BranchTarget } from "@/features/target/targetApiSlice";
import { months } from "@/components/ui/data/data";

export const targetColumns = (
  branchesType: Array<{
    value: string;
    label: string;
    color: string;
    icon?: React.ElementType;
  }>,
  hasDistrict: boolean // Pass this flag based on the row data
): ColumnDef<BranchTarget>[] => {
  const columns: ColumnDef<BranchTarget>[] = [
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
      accessorKey: "accountOnboarding",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "agentRegistration",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Agent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "inactiveAccount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Inactive
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      // cell: ({ row }) => {
      //   const year = years.find((year) => year.value === row.getValue("year"));

      //   return (
      //     <div className="flex items-center" style={{ color: year?.color }}>
      //       {year?.icon && <year.icon className="mr-2 h-4 w-4" />}
      //       <span>{year?.label}</span>
      //     </div>
      //   );
      // },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "month",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Month
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const month = months.find(
          (month) => month.value === row.getValue("month")
        );

        return (
          <div className="flex items-center" style={{ color: month?.color }}>
            {/* {month?.icon && <month.icon className="mr-2 h-4 w-4" />} */}
            <span>{month?.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ];

  if (hasDistrict) {
    columns.splice(1, 0, {
      accessorKey: "district",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          District
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          {row.original.district} <span className="text-primary">District</span>
        </span>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    });
  } else {
    columns.splice(1, 0, {
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
      cell: ({ row }) => {
        const branch = branchesType.find(
          (branch) => branch.value === row.getValue("branch")
        );

        return (
          <div
            className="flex w-[100px] items-center"
            style={{ color: branch?.color }}
          >
            {branch?.icon && <branch.icon className="mr-2 h-4 w-4" />}
            <span>{branch?.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    });
  }

  return columns;
};
