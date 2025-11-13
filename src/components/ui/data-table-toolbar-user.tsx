import { Table } from "@tanstack/react-table";

import { userStatus } from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "./button";
import { DataTableViewOptions } from "./data-table-view-options";
import { useEffect, useState } from "react";
import { CrossIcon } from "lucide-react";
import { useGetAllBranchesQuery } from "@/features/branches/branchApiSlice";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbarUser<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [formattedBranches, setFormattedBranches] = useState<
    { value: string; label: string }[]
  >([]);

  const { data: res } = useGetAllBranchesQuery();

  // Helper function to safely get column
  const getColumnSafely = (columnId: string) => {
    try {
      return table.getColumn(columnId);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchBranch = async () => {
      const data = res instanceof Array ? res : [];

      // Map branches to desired format
      const formatted = data.map((branch) => ({
        value: branch.branchCode || "",
        label: branch.branchCode || "",
      }));
      setFormattedBranches(formatted);
    };
    fetchBranch();
  }, [res]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {getColumnSafely("status") && (
          <DataTableFacetedFilter
            column={getColumnSafely("status")!}
            title="Status"
            options={userStatus}
          />
        )}
        {getColumnSafely("branch") && (
          <DataTableFacetedFilter
            column={getColumnSafely("branch")!}
            title="Branch"
            options={formattedBranches}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <CrossIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="ml-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
