import React, { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneCall, UserPlus, UserCheck } from "lucide-react";
import { UserReportResponse } from "@/features/reports/reportApiSlice";

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  additionalInfo?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon,
  color,
  additionalInfo,
}) => (
  <Card className="border rounded hover:shadow-lg transition-shadow duration-300 ease-in-out">
    <CardHeader className="flex items-center justify-between">
      <CardTitle className={`text-lg font-semibold text-${color}`}>
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent className={`text-3xl font-bold text-${color}`}>
      {count}
      {additionalInfo && (
        <div className="text-sm text-gray-500">{additionalInfo}</div>
      )}
    </CardContent>
  </Card>
);

const TIMEFRAMES = ["Today", "This Week", "This Month"] as const;

type UserDetailPresentationProps = {
  userReports: UserReportResponse | undefined;
};

const UserDetailPresentation: FC<UserDetailPresentationProps> = ({
  userReports,
}) => {
  const [callRequests, setCallRequests] =
    useState<(typeof TIMEFRAMES)[number]>("Today");

  const callRequestData: Record<(typeof TIMEFRAMES)[number], number> = {
    Today: 5,
    "This Week": 20,
    "This Month": 45,
  };

  const handleTimeFilterChange = (timeframe: (typeof TIMEFRAMES)[number]) =>
    setCallRequests(timeframe);

  return (
    <div className="space-y-6 container mx-auto mt-8 p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Approved Accounts"
          count={
            (userReports?.approvedAccounts || 0) +
            (userReports?.accountsByAgents || 0)
          }
          icon={<UserPlus className="h-6 w-6 text-[#00A9E8]" />}
          color="#00A9E8"
          additionalInfo={`(${userReports?.approvedAccounts || 0} Direct, ${
            userReports?.accountsByAgents || 0
          } by Agents)`}
        />
        <StatsCard
          title="To Other Branch"
          count={userReports?.accountsRegisterToOtherBranch || 0}
          icon={<UserCheck className="h-6 w-6 text-green-500" />}
          color="text-green-500"
        />
        <StatsCard
          title="Total Accounts"
          count={userReports?.totalAccounts || 0}
          icon={<UserCheck className="h-6 w-6 text-green-500" />}
          color="text-green-500"
        />
        <StatsCard
          title="Registered Agents"
          count={userReports?.agentCount || 0}
          icon={<UserCheck className="h-6 w-6 text-orange-500" />}
          color="text-orange-500"
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mt-8 px-4 md:px-0">
        <h6 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-0">
          Call Requests
        </h6>

        <div className="flex space-x-2">
          {TIMEFRAMES.map((timeframe) => (
            <Button
              key={timeframe}
              variant="outline"
              onClick={() => handleTimeFilterChange(timeframe)}
              className={`px-4 py-2 rounded-md border ${
                callRequests === timeframe
                  ? "bg-[#00A9E8] text-white border-[#00A9E8]"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:bg-gray-100 transition-colors duration-200`}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      <Card className="mt-6 border border-gray-200 rounded-lg">
        <CardContent className="flex items-center space-x-2 py-4 px-6 bg-gray-100 border-b">
          <PhoneCall className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700 text-base md:text-lg">
            Call requests for:{" "}
            <strong className="text-[#00A9E8]">{callRequests}</strong>
          </span>
        </CardContent>

        <CardContent className="py-6 px-6 text-gray-600 text-sm md:text-base">
          {callRequestData[callRequests] > 0
            ? `${callRequestData[callRequests]} call requests available for the selected timeframe.`
            : "No call requests available for the selected timeframe."}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailPresentation;
