import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import ErrorPage from "@/pages/client/Error";

import DashboardPage from "@/pages/client/Dashboard";
import AccountPage from "@/pages/client/Account";
import InactiveAccountPage from "@/pages/client/InactiveAccount";
import ProspectivePage from "@/pages/client/Prospective";
import AgentPage from "@/pages/client/Agent";
import UserPage from "@/pages/client/User";
import SettingPage from "@/pages/client/Setting";
import ClientPage from "@/pages/client/Client";
import AccountDetailPage from "@/pages/client/AccountDetail";
import TargetPage from "@/pages/client/Target";
import ProspectiveDetailPage from "@/pages/client/ProspectiveDetail";
import InactiveAccountDetailPage from "@/pages/client/InactiveAccountDetail";
import LoginCard from "@/pages/client/SignIn";
import ClientDashboardPage from "@/pages/client/ClientDashboard";
import UserDetailPage from "@/pages/client/UserDetail";
import NetworkGraph from "@/pages/client/Test";
import { AdminHPCSidebar } from "@/components/sidebar/admin-hpc-sidebar";
import HPCDashboardPage from "@/pages/hpc/HPCDashboard";
import createProtectedRoute from "./createProtectedRoute";
import CRMPage from "@/pages/hpc/CRM";
import HPCustomerPage from "@/pages/hpc/HPCustomer";
import CalenderPage from "@/pages/hpc/Calender";
import HPCDetailPage from "@/pages/hpc/HPCDetail";
import OrganizationPage from "@/pages/hpc/OrganizationalAccount";

import TaskPresentation from "@/components/presentation/hpc/TaskPresentation";
import Taskdetails from "@/components/presentation/hpc/components/tasks/task-details";
import CrmSetting from "@/pages/hpc/CrmSetting";
import VisitDashboardPage from "@/pages/branch-visit/VisitDashboard";
import { BranchVisitSidebar } from "@/components/sidebar/branch-visit-sidebar";
import VisitUser from "@/pages/branch-visit/VisitUser";
import VisitTargetPage from "@/pages/branch-visit/VisitTarget";
import FeedbackPage from "@/pages/branch-visit/Feedback";
import RtgsPage from "@/pages/client/Rtgs";
import RtgsAdminPage from "@/pages/rtgs/RtgsAdmin";
import { RtgsSidebar } from "@/components/sidebar/rtgs-sidebar";
import RtgsMatcherPage from "@/pages/rtgs/RtgsMatcher";
import KYCUsers from "@/pages/kyc/KYCUsers";
import OrganizationDetailPage from "@/pages/client/OrganizationalAccount";
import JointDetailPage from "@/pages/client/jointAccount";
import ForgotPassword from "@/pages/client/ForgotPassword";
import ResetPassword from "@/pages/client/ResetPassword";
import ChangePassword from "@/pages/client/ChangePassword";
import FlowSettingsPage from "@/pages/client/FlowSettings";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route path="/sign-in" element={<LoginCard />} />
      <Route path="/test" element={<NetworkGraph />} />
      <Route path="auth/forgotpassword" element={<ForgotPassword />} />
      {createProtectedRoute({
        path: "/",
        element: <DashboardPage />,
      })}

      <Route path="/reset-password" element={<ResetPassword />} />

      {createProtectedRoute({
        path: "/change-password",
        element: <ChangePassword />,
      })}

      {createProtectedRoute({
        path: "/clients",
        element: <ClientPage />,
      })}
      {createProtectedRoute({
        path: "/kyc-admins",
        element: <KYCUsers />,
      })}

      {createProtectedRoute({
        path: "/branch-visit",
        element: <VisitDashboardPage />,
        sidebarComponent: <BranchVisitSidebar />,
      })}
      {createProtectedRoute({
        path: "/rtgs/matchers",
        element: <RtgsMatcherPage />,
        sidebarComponent: <RtgsSidebar />,
      })}
      {createProtectedRoute({
        path: "/rtgs",
        element: <RtgsAdminPage />,
        sidebarComponent: <RtgsSidebar />,
      })}
      {createProtectedRoute({
        path: "/branch-visit/users",
        element: <VisitUser />,
        sidebarComponent: <BranchVisitSidebar />,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/rtgs",
        element: <RtgsPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/branch-visit/targets",
        element: <VisitTargetPage />,
        sidebarComponent: <BranchVisitSidebar />,
      })}
      {createProtectedRoute({
        path: "/branch-visit/feedback",
        element: <FeedbackPage />,
        sidebarComponent: <BranchVisitSidebar />,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId",
        element: <ClientDashboardPage />,
        useClientSidebar: true,
      })}

      {createProtectedRoute({
        path: "/clients/:clientId/accounts",
        element: <AccountPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/targets",
        element: <TargetPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/targets",
        element: <TargetPage />,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/accounts/:accountId",
        element: <AccountDetailPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/inactive",
        element: <InactiveAccountPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/inactive/:inactiveAccountId",
        element: <InactiveAccountDetailPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/prospectives/:prospectiveId",
        element: <ProspectiveDetailPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/prospectives",
        element: <ProspectivePage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/prospective/:prospectiveId",
        element: <ProspectiveDetailPage />,
      })}
      {createProtectedRoute({
        path: "/prospective",
        element: <ProspectivePage />,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/users",
        element: <UserPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/users/:userId",
        element: <UserDetailPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/clients/:clientId/agents",
        element: <AgentPage />,
        useClientSidebar: true,
      })}
      {createProtectedRoute({
        path: "/hpc",
        element: <HPCDashboardPage />,
        sidebarComponent: <AdminHPCSidebar />,
      })}
      {createProtectedRoute({
        path: "/hpc/crm",
        element: <CRMPage />,
        sidebarComponent: <AdminHPCSidebar />,
      })}
      {createProtectedRoute({
        path: "/crm",
        element: <CRMPage />,
      })}
      {createProtectedRoute({
        path: "/hpc/customers",
        element: <HPCustomerPage />,
        sidebarComponent: <AdminHPCSidebar />,
      })}
      {createProtectedRoute({
        path: "/hpc/customers/:customerId",
        element: <HPCDetailPage />,
        sidebarComponent: <AdminHPCSidebar />,
      })}
      {createProtectedRoute({
        path: "/hpc/calendar",
        element: <CalenderPage />,
        sidebarComponent: <AdminHPCSidebar />,
      })}
      {createProtectedRoute({
        path: "/customers",
        element: <HPCustomerPage />,
      })}
      {createProtectedRoute({
        path: "/organizational",
        element: <OrganizationPage />,
      })}
      {createProtectedRoute({
        path: "/customers/:customerId",
        element: <HPCDetailPage />,
      })}
      {createProtectedRoute({
        path: "/calendar",
        element: <CalenderPage />,
      })}
      {createProtectedRoute({
        path: "/accounts", // ✅ Individual accounts index
        element: <AccountPage />,
      })}
      {createProtectedRoute({
        path: "/accounts/:accountId", // ✅ Individual detail
        element: <AccountDetailPage />,
      })}

      {createProtectedRoute({
        path: "/joint-accounts", // ✅ Joint index
        element: <AccountPage />,
      })}
      {createProtectedRoute({
        path: "/joint-accounts/:accountId", // ✅ Joint detail
        element: <JointDetailPage />,
      })}

      {createProtectedRoute({
        path: "/organizational-accounts", // ✅ Org index
        element: <AccountPage />,
      })}
      {createProtectedRoute({
        path: "/organizational-accounts/:accountId", // ✅ Org detail
        element: <OrganizationDetailPage />,
      })}

      {createProtectedRoute({
        path: "/organizational-accounts",
        element: <AccountPage />, // ✅ Add this too if needed
      })}


      {createProtectedRoute({
        path: "/inactive",
        element: <InactiveAccountPage />,
      })}
      {createProtectedRoute({
        path: "/agents",
        element: <AgentPage />,
      })}
      {createProtectedRoute({
        path: "/users",
        element: <UserPage />,
      })}
      {createProtectedRoute({
        path: "/users/:userId",
        element: <UserDetailPage />,
      })}
      {createProtectedRoute({
        path: "/settings",
        element: <SettingPage />,
      })}
      {createProtectedRoute({
        path: "/flow-settings",
        element: <FlowSettingsPage />,
      })}
      {createProtectedRoute({
        path: "/crm-settings",
        element: <CrmSetting />,
      })}
      {createProtectedRoute({
        path: "/hpc/settings",
        element: <CrmSetting />,
        sidebarComponent: <AdminHPCSidebar />,
      })}
      {createProtectedRoute({
        path: "/tasks",
        element: <TaskPresentation />,
      })}
      {createProtectedRoute({
        path: "/tasks/:taskId",
        element: <Taskdetails />,
      })}
    </Route>
  )
);

export default router;
