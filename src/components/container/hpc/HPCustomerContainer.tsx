import React, { useMemo } from "react";
import { HPCustomerPresentation } from "@/components/presentation/hpc";
import {
  useGetHighProfileCustomersByCRMQuery,
  useGetHighProfileCustomersQuery,
} from "@/features/hpc/hpcApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";

const HPCustomerContainer: React.FC = () => {
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useGetCurrentUserQuery();

  // Fetch all HPC data
  const {
    data: allHpcData,
    isLoading: isAllHpcLoading,
    error: allHpcError,
  } = useGetHighProfileCustomersQuery();

  // Fetch CRM-specific HPC data
  const {
    data: crmHpcData,
    isLoading: isCrmHpcLoading,
    error: crmHpcError,
  } = useGetHighProfileCustomersByCRMQuery(Number(currentUser?.userId) || 0);

  // Determine which data to use
  const hpcData = useMemo(() => {
    if (currentUser?.role === "CRM") {
      return crmHpcData;
    }
    return allHpcData;
  }, [currentUser?.role, crmHpcData, allHpcData]);

  // Combine loading and error states
  const isLoading = isUserLoading || isAllHpcLoading || isCrmHpcLoading;
  const error = userError || allHpcError || crmHpcError;

  if (isLoading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-5 text-red-500">
        An error occurred while fetching data.
      </div>
    );
  }

  return (
    <div className="p-5">
      <HPCustomerPresentation hpcData={hpcData || []} />
    </div>
  );
};

export default HPCustomerContainer;
