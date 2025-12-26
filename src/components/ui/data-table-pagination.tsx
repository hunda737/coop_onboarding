import { Table } from "@tanstack/react-table";

import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  ArrowLeftIcon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface PaginationInfo {
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  paginationInfo?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataTablePagination<TData>({
  table,
  paginationInfo,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  // Determine if we should use server-side pagination
  const useServerPagination = paginationInfo !== undefined && onPageChange !== undefined && onPageSizeChange !== undefined;

  // Get current pagination values
  const currentPage = useServerPagination ? paginationInfo.currentPage : table.getState().pagination.pageIndex;
  const pageSize = useServerPagination ? paginationInfo.pageSize : table.getState().pagination.pageSize;
  const totalPages = useServerPagination ? paginationInfo.totalPages : table.getPageCount();
  const totalElements = useServerPagination ? paginationInfo.totalElements : table.getFilteredRowModel().rows.length;

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    if (useServerPagination) {
      onPageSizeChange(newSize);
    } else {
      table.setPageSize(newSize);
    }
  };

  // Handle page navigation
  const handleFirstPage = () => {
    if (useServerPagination) {
      onPageChange(0);
    } else {
      table.setPageIndex(0);
    }
  };

  const handlePreviousPage = () => {
    if (useServerPagination) {
      onPageChange(Math.max(0, currentPage - 1));
    } else {
      table.previousPage();
    }
  };

  const handleNextPage = () => {
    if (useServerPagination) {
      onPageChange(Math.min(totalPages - 1, currentPage + 1));
    } else {
      table.nextPage();
    }
  };

  const handleLastPage = () => {
    if (useServerPagination) {
      onPageChange(totalPages - 1);
    } else {
      table.setPageIndex(table.getPageCount() - 1);
    }
  };

  const canPreviousPage = currentPage > 0;
  const canNextPage = currentPage < totalPages - 1;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {useServerPagination ? (
          <>
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} row(s)
          </>
        ) : (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage + 1} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleFirstPage}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNextPage}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={handleLastPage}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
