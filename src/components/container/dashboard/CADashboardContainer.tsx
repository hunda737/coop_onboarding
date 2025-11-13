import { CADashboardPresentation } from "@/components/presentation/dashboard";
import { useGetReportQuery } from "@/features/reports/reportApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useState } from "react";
import { useParams } from "react-router-dom";

const CADashboardContainer = () => {
  const params = useParams();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data: currentUser, isLoading: isLoadingCurrentUser, isError: isErrorCurrentUser } = useGetCurrentUserQuery();

  const { data: reports, isLoading: isLoadingReports, isError: isErrorReports } = useGetReportQuery({
    cliendId: params.clientId ? params.clientId : "",
  });

  if (isLoadingCurrentUser) return <div>Loading...</div>;
  if (isErrorCurrentUser) return <div>Error loading current user</div>;
  if (isLoadingReports) return <div>Loading...</div>;
  if (isErrorReports) return <div>Error loading reports</div>;

  return (
    <div>
      <CADashboardPresentation
        reports={reports}
        currentUser={currentUser}
        setYear={setYear}
        year={year}
      />
    </div>
  );
};

export default CADashboardContainer;
