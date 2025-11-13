// src/components/presentation/dashboard/UserDashboard.tsx

import AccountByTypePieChart from "@/components/charts/AccountByTypePieChart";
import BottomFiveBranches from "@/components/charts/BottomFiveBranches";
import NewAccountsVsTarget from "@/components/charts/NewAccountsVsTarget";
import TopFiveBranches from "@/components/charts/TopFiveBranches";
import DashboardCards from "./DashboardCards";
import TargetRadial from "@/components/charts/TargetRadial";
import { ReportResponse } from "@/features/reports/reportApiSlice";
import ThisMonthReport from "@/components/charts/ThisMonthReport";
import { User } from "@/features/user/userApiSlice";
import TopFiveStaffs from "@/components/charts/TopFiveStaff";

type CADashboardPresentationProps = {
  reports: ReportResponse | undefined;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  currentUser: User | undefined;
};

const CADashboardPresentation: React.FC<CADashboardPresentationProps> = ({
  reports,
  setYear,
  year,
  currentUser,
}) => {
  return (
    <div className="space-y-4 w-full">
      <DashboardCards
        accountsGroupedByStatusAndMonthlyData={
          reports?.accountsGroupedByStatusAndMonthlyData
        }
      />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 md:col-span-2 lg:col-span-1 w-full">
          <ThisMonthReport
            currentMonthTargetAchievements={
              reports?.currentMonthTargetAchievements
            }
          />
        </div>
        <div className="col-span-4 lg:col-span-2">
          <NewAccountsVsTarget
            districtTargetAndAchievementsMonthly={
              reports?.districtTargetAndAchievementsMonthly
            }
            setYear={setYear}
            year={year}
          />
        </div>
        <div className="col-span-4 md:col-span-2 lg:col-span-1">
          <TargetRadial
            accountsGroupedByStatusAndMonthlyData={
              reports?.accountsGroupedByStatusAndMonthlyData
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {currentUser?.role === "SUPER-ADMIN" ||
        currentUser?.role === "CLIENT-ADMIN" ? (
          <div className="col-span-3 md:col-span-2 lg:col-span-1">
            <TopFiveBranches
              detailedBranchReports={reports?.detailedBranchReports}
            />
          </div>
        ) : (
          currentUser?.role === "BRANCH-ADMIN" && (
            <div className="col-span-3 md:col-span-2 lg:col-span-1">
              <TopFiveStaffs
                eachBranchUsersAchievements={
                  reports?.eachBranchUsersAchievements
                }
              />
            </div>
          )
        )}
        {(currentUser?.role === "SUPER-ADMIN" ||
          currentUser?.role === "CLIENT-ADMIN") && (
          <div className="col-span-3 md:col-span-2 lg:col-span-1">
            <BottomFiveBranches
              detailedBranchReports={reports?.detailedBranchReports}
            />
          </div>
        )}
        <AccountByTypePieChart
          detailedBranchReports={reports?.accountsGroupedByAccountType}
        />
      </div>
    </div>
  );
};

export default CADashboardPresentation;
