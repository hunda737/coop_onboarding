import { apiSlice } from "../api/apiSlice";

// Define types for the data structures in the response
export interface MonthlyData {
  JULY: number;
  NOVEMBER: number;
  JUNE: number;
  FEBRUARY: number;
  MAY: number;
  MARCH: number;
  APRIL: number;
  SEPTEMBER: number;
  DECEMBER: number;
  JANUARY: number;
  OCTOBER: number;
  AUGUST: number;
}

export interface AccountStatusData {
  totalData: number;
  data: MonthlyData;
}

export interface AccountByStatusByMonth {
  [status: string]: AccountStatusData; // ✅ dynamic access enabled
}


export interface BranchReport {
  accountsAddedByOtherBranchStaff: number;
  agentCount: number;
  accountsRegisterToOtherBranch: number;
  accountsByAgents: number;
  totalAccounts: number;
  approvedAccounts: number;
}

export interface DistrictTarget {
  month: string;
  registration: number;
  target: number;
}

export interface DistrictStatisticsSummary {
  totalBranches: number;
  totalApprovedAccounts: number;
  totalAccountsByAgents: number;
  totalAccounts: number;
  totalAccountsAddedByOtherBranchStaff: number;
  totalAgentCount: number;
  totalAccountsRegisterToOtherBranchStaff: number;
  accountsRegisterToOtherBranch: number;
}

export interface AccountByType {
  "Fixed Time Deposit Account": number;
  "Non-Repatriable Birr Account": number;
  "Deposit Account": number;
  "Diaspora Wadia Saving Account": number;
}

export interface UserReport {
  id: number;
  accountCount: number;
  userName: string;
}
export interface CurrentMonthProps {
  name: string;
  target: number;
  achievements: number;
}

export interface ReportResponse {
  accountsGroupedByStatusAndMonthlyData: AccountByStatusByMonth;
  clientCode: string;
  detailedBranchReports: Record<string, BranchReport>;
  clientName: string;
  districtStatisticsSummary: DistrictStatisticsSummary;
  districtTargetAndAchievementsMonthly: DistrictTarget[];
  accountsGroupedByAccountType: AccountByType;
  eachBranchUsersAchievements: UserReport[];
  currentMonthTargetAchievements: CurrentMonthProps[];
}

interface ReportRequest {
  cliendId?: string;
  userId?: string;
}

export interface UserReportResponse {
  approvedAccounts: number;
  accountsByAgents: number;
  accountsRegisterToOtherBranch: number;
  agentCount: number;
  totalAccounts: number;
}

// Define the report API slice
const reportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.query<ReportResponse, ReportRequest>({
      query: (data) => ({
        url: `/api/v1/users/report?clientId=${data.cliendId}`,
        method: "GET",
      }),
    }),

    getUserReport: builder.query<UserReportResponse, ReportRequest>({
      query: (data) => ({
        url: `/api/v1/accounts/get-user-report?userId=${data.userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetReportQuery, useGetUserReportQuery } = reportApi;
