import { useGetReportQuery } from "@/features/reports/reportApiSlice";
import { useState } from "react";
import { useParams } from "react-router-dom";
import UserDashboardPresentation from "../presentation/dashboard/UserDashboard";

import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";

const UserDashboardContainer = () => {
  const params = useParams();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUserQuery();

  // For super admins: use params.clientId from URL (/{clientId}/clients)
  // For other users: use currentUser.client.id (URL is just /)
  const clientId = params.clientId || currentUser?.client?.id?.toString() || "";

  const { data: reports, isLoading: isLoadingReports, isError: isErrorReports } = useGetReportQuery({
    cliendId: clientId,
  }, {
    skip: !clientId, // Skip query if clientId is not available yet
  });

  if (isLoadingUser || isLoadingReports) return <div>Loading...</div>;
  if (isErrorReports) return <div>Error loading reports</div>;

  return (
    <>
      <UserDashboardPresentation
        reports={reports}
        setYear={setYear}
        year={year}
        currentUser={currentUser} // Pass just the user data
      />
    </>
  );
};

export default UserDashboardContainer;
