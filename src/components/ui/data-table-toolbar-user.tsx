import { Table } from "@tanstack/react-table";

import { userStatus } from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "./button";
import { DataTableViewOptions } from "./data-table-view-options";
import { useEffect, useState } from "react";
import { CrossIcon } from "lucide-react";
import { useGetAllBranchesQuery } from "@/features/branches/branchApiSlice";
import { useGetAllRolesQuery } from "@/features/roles/roleApiSlice";

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
  const [formattedRoles, setFormattedRoles] = useState<
    { value: string; label: string }[]
  >([]);

  const { data: branches } = useGetAllBranchesQuery();
  const { data: roles } = useGetAllRolesQuery();

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
      const data = branches instanceof Array ? branches : [];

      // Map branches to desired format - use name for filtering
      const formatted = data.map((branch) => ({
        value: branch.companyName || "",
        label: branch.companyName || "",
      }));
      setFormattedBranches(formatted);
    };
    fetchBranch();
  }, [branches]);

  useEffect(() => {
    const fetchRoles = async () => {
      const data = roles instanceof Array ? roles : [];

      // Map roles to desired format
      const formatted = data
        .filter((role) => role.roleName !== "SUPER-ADMIN")
        .filter((role) => !role.roleName.includes("CRM"))
        .filter((role) => !role.roleName.includes("VISIT"))
        .map((role) => ({
          value: role.roleName || "",
          label: role.roleName || "",
        }));
      setFormattedRoles(formatted);
    };
    fetchRoles();
  }, [roles]);

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
        {getColumnSafely("role") && formattedRoles.length > 0 && (
          <DataTableFacetedFilter
            column={getColumnSafely("role")!}
            title="Role"
            options={formattedRoles}
          />
        )}
        {getColumnSafely("mainBranch") && formattedBranches.length > 0 && (
          <DataTableFacetedFilter
            column={getColumnSafely("mainBranch")!}
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
