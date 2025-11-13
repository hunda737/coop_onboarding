import { FC } from "react";
import { Book } from "lucide-react";
import { UserReportResponse } from "@/features/reports/reportApiSlice";

type UserDashboardCardsProps = {
  userReports: UserReportResponse | undefined;
};

const UserDashboardCards: FC<UserDashboardCardsProps> = ({ userReports }) => {
  const stats = [
    {
      title: "Approved Accounts",
      value: {
        directlyAdded: userReports?.approvedAccounts || 0,
        byAgents: userReports?.accountsByAgents || 0,
      },
      color: "text-[#505050]",
    },
    {
      title: "To Other Branches",
      value: userReports?.accountsRegisterToOtherBranch || 0,
      color: "text-[#505050]",
    },
    {
      title: "Total Accounts",
      value: userReports?.totalAccounts || 0,
      color: "text-[#505050]",
    },
    {
      title: "Registered Agents",
      value: userReports?.agentCount || 0,
      color: "text-[#505050]",
    },
  ];

  return (
    <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
      {stats.map((stat, index) => (
        <div key={index} className="w-full">
          <div className="border rounded-md shadow p-4">
            <div className="flex flex-row items-center justify-between pb-1">
              <h2 className={`text-lg font-medium ${stat.color}`}>
                {stat.title}
              </h2>
              <Book size={20} className={stat.color} />
            </div>
            <div>
              {typeof stat.value === "object" &&
              stat.value !== null &&
              "directlyAdded" in stat.value ? (
                <div className={`text-1xl font-bold ${stat.color}`}>
                  {`${
                    stat.value.directlyAdded + stat.value.byAgents
                  } (Direct: ${stat.value.directlyAdded}, By Agents: ${
                    stat.value.byAgents
                  })`}
                </div>
              ) : (
                <div className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDashboardCards;
