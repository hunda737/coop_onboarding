import { DataTable } from "@/components/ui/data-table";
import { HarmonizationItem } from "@/features/harmonization/harmonizationApiSlice";
import { FC } from "react";
import { harmonizationColumns } from "./components/harmonization/harmonization-column";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HarmonizationPresentationProps = {
  data: HarmonizationItem[];
  isLoading: boolean;
  isError: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-[500px] w-full" />
  </div>
);

const ErrorDisplay = () => (
  <div className="p-4 text-red-600 bg-red-100 rounded-md">
    Failed to load harmonization data. Please try again later.
  </div>
);

const HarmonizationPresentation: FC<HarmonizationPresentationProps> = ({
  data,
  isLoading,
  isError,
  totalElements,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorDisplay />;

  // Ensure data is an array
  const tableData = Array.isArray(data) ? data : [];
  
  return (
    <div className="space-y-4">
      <div className="[&_>div>div:last-child]:hidden">
        <DataTable
          columns={harmonizationColumns}
          data={tableData}
          type="harmonization"
          searchKey="accountNumber"
          clickable={false}
          onUrl={false}
        />
      </div>
      
      {/* Server-side pagination controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {tableData.length} of {totalElements} entries
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 w-[70px] rounded-md border border-input bg-background px-2 text-sm"
            >
              {[10, 20, 30, 40, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage + 1} of {totalPages || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarmonizationPresentation;

