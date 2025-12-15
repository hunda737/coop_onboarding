import { useGetHarmonizationQuery } from "@/features/harmonization/harmonizationApiSlice";
import { useState } from "react";
import HarmonizationPresentation from "@/components/presentation/clients/HarmonizationPresentation";

const HarmonizationContainer = () => {
  const [page, setPage] = useState(0); // API uses 0-based indexing
  const [size, setSize] = useState(10);

  const { data, isLoading, isError } = useGetHarmonizationQuery({
    page,
    size,
  });

  // Handle both response formats: object with content property or array directly
  const harmonizationData = Array.isArray(data) 
    ? data 
    : (data?.content || []);
  
  const totalElements = Array.isArray(data)
    ? data.length
    : (data?.totalElements || 0);
  
  const totalPages = Array.isArray(data)
    ? 1
    : (data?.totalPages || 0);

  const handlePageChange = (newPage: number) => {
    // newPage is already 0-based, API also uses 0-based
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  return (
    <HarmonizationPresentation
      data={harmonizationData}
      isLoading={isLoading}
      isError={isError}
      totalElements={totalElements}
      totalPages={totalPages}
      currentPage={page} // Already 0-based
      pageSize={size}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export default HarmonizationContainer;

