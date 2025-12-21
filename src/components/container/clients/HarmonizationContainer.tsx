import { useState, useMemo, useEffect } from "react";
import { useGetHarmonizationsQuery } from "@/features/harmonization/harmonizationApiSlice";
import HarmonizationPresentation from "@/components/presentation/clients/HarmonizationPresentation";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useGetAllDistrictsQuery } from "@/features/branches/branchApiSlice";
import { isRoleAuthorized } from "@/types/authorities";

type HarmonizationStatus = "PENDING_KYC" | "MERGED" | "REJECTED";
type FilterType = "SELF_ONBOARD" | "BRANCH";

const STORAGE_KEY = "harmonization_filters";

// Map UI status to backend status
const mapStatusToBackend = (status: HarmonizationStatus): string => {
  const statusMap: Record<HarmonizationStatus, string> = {
    PENDING_KYC: "PENDING_KYC_REVIEW",
    MERGED: "MERGED",
    REJECTED: "REJECTED",
  };
  return statusMap[status];
};

// Load filters from localStorage
const loadFiltersFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading filters from storage:", error);
  }
  return null;
};

// Save filters to localStorage
const saveFiltersToStorage = (filters: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error("Error saving filters to storage:", error);
  }
};



const HarmonizationContainer = () => {
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: districts } = useGetAllDistrictsQuery();
  const isFilterAuthorized = currentUser ? isRoleAuthorized(currentUser.role, ["ACCOUNT-APPROVER", "SUPER-ADMIN"]) : false;
  
console.log(currentUser);
  // Load initial state from localStorage
  const savedFilters = loadFiltersFromStorage();
  
  const [status, setStatus] = useState<HarmonizationStatus>(
    savedFilters?.status || "PENDING_KYC"
  );
  const [filterType, setFilterType] = useState<FilterType>(
    savedFilters?.filterType || "SELF_ONBOARD"
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>(
    savedFilters?.selectedDistrictId
  );
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(
    savedFilters?.selectedBranchId
  );
  
  const backendStatus = useMemo(() => mapStatusToBackend(status), [status]);
  
  // Save filters to localStorage whenever they change
  useEffect(() => {
    saveFiltersToStorage({
      status,
      filterType,
      selectedDistrictId,
      selectedBranchId,
    });
  }, [status, filterType, selectedDistrictId, selectedBranchId]);
  
  // Automatically select first district when Branch filter is selected
  useEffect(() => {
    if (filterType === "BRANCH" && districts && districts.length > 0 && !selectedDistrictId) {
      setSelectedDistrictId(districts[0].id);
    }
  }, [filterType, districts, selectedDistrictId]);
  
  // Determine branchId: 0 for self onboard, selectedBranchId for branch (undefined if no branch selected)
  const branchId = useMemo(() => {
    if (filterType === "SELF_ONBOARD") {
      return 0;
    }
    return selectedBranchId;
  }, [filterType, selectedBranchId]);
  
  // For non-authorized users, fetch all harmonizations without filters
  const { data: harmonizations, isLoading, isFetching, isError, error } = useGetHarmonizationsQuery(
    isFilterAuthorized 
      ? { status: backendStatus, branchId, districtId: selectedDistrictId }
      : {},
    {
      refetchOnMountOrArgChange: true, // Always refetch when arguments change or component mounts
    }
  );

  // Log for debugging
  if (error) {
    console.error("Harmonization API Error:", error);
  }
  
  if (harmonizations) {
    console.log("Harmonizations data:", harmonizations);
  }

  return (
    <HarmonizationPresentation
      harmonizations={harmonizations || []}
      isLoading={isLoading || isFetching}
      isError={isError}
      error={error}
      status={status}
      onStatusChange={setStatus}
      filterType={filterType}
      onFilterTypeChange={setFilterType}
      selectedDistrictId={selectedDistrictId}
      onDistrictIdChange={setSelectedDistrictId}
      selectedBranchId={selectedBranchId}
      onBranchIdChange={setSelectedBranchId}
    />
  );
};

export default HarmonizationContainer;

