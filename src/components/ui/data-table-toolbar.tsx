import { Table } from "@tanstack/react-table";

import {
  statuses,
  // harmonizationStatuses,
  operations,
  sex,
  accountType,
  years,
  months,
  customerType
} from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "./button";
import { DataTableViewOptions } from "./data-table-view-options";
import { CrossIcon } from "lucide-react";
import { useGetBranchesByDistrictQuery } from "@/features/branches/branchApiSlice";
import { useParams } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useGetClientByIdQuery } from "@/features/client/clientApiSlice";
import { getBranchesType } from "./data/getBranchesType";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  type?: string;
}

export function DataTableToolbar<TData>({
  table,
  type,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: client } = useGetClientByIdQuery(
    params?.clientId ? params?.clientId : String(currentUser?.client?.id)
  );
  const { data: branches } = useGetBranchesByDistrictQuery(
    client?.district ? client?.district : ""
  );

  const branchesType = getBranchesType(branches);

  // Helper function to safely get column
  const getColumnSafely = (columnId: string) => {
    try {
      return table.getColumn(columnId);
    } catch {
      return null;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {getColumnSafely("status") && type !== "harmonization" && (
          <DataTableFacetedFilter
            column={getColumnSafely("status")!}
            title="Status"
            options={statuses}
          />
        )}
        {getColumnSafely("sex") && (
          <DataTableFacetedFilter
            column={getColumnSafely("sex")!}
            title="Gender"
            options={sex}
          />
        )}
        {getColumnSafely("accountType") && (
          <DataTableFacetedFilter
            column={getColumnSafely("accountType")!}
            title="Account Type"
            options={accountType}
          />)}
        {getColumnSafely("customerType") && (
          <DataTableFacetedFilter
            column={getColumnSafely("customerType")!}
            title="Customer Type"
            options={customerType}
          />
        )}
        {getColumnSafely("year") && (
          <DataTableFacetedFilter
            column={getColumnSafely("year")!}
            title="Year"
            options={years}
          />
        )}
        {getColumnSafely("month") && (
          <DataTableFacetedFilter
            column={getColumnSafely("month")!}
            title="Month"
            options={months}
          />
        )}
        {branchesType && getColumnSafely("branch") && (
          <DataTableFacetedFilter
            column={getColumnSafely("branch")!}
            title="Branch"
            options={branchesType}
          />
        )}
        {getColumnSafely("operation") && (
          <DataTableFacetedFilter
            column={getColumnSafely("operation")!}
            title="Operation"
            options={operations}
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
