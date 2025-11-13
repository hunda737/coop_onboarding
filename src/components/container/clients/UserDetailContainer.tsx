import { UserDetailPresentation } from "@/components/presentation/clients";
import { useGetUserReportQuery } from "@/features/reports/reportApiSlice";
import { useParams } from "react-router-dom";

const UserDetailContainer = () => {
  const params = useParams();
  const { data: userReports } = useGetUserReportQuery({
    userId: params.userId,
  });
  return (
    <div>
      <UserDetailPresentation userReports={userReports} />
    </div>
  );
};

export default UserDetailContainer;
