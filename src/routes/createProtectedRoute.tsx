import ProtectedRoute from "@/components/presentation/ProtectedRoute";
import { AdminClientSidebar } from "@/components/sidebar/admin-client-sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/ui/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Route } from "react-router-dom";

type RouteProps = {
  path: string;
  element: JSX.Element;
  useClientSidebar?: boolean;
  sidebarComponent?: JSX.Element;
};

const createProtectedRoute = ({
  path,
  element,
  useClientSidebar = false,
  sidebarComponent,
}: RouteProps) => (
  <Route
    path={path}
    element={
      <ProtectedRoute>
        <SidebarProvider>
          {sidebarComponent ||
            (useClientSidebar ? <AdminClientSidebar /> : <AppSidebar />)}
          <SidebarInset>
            <Header />
            {element}
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    }
  />
);

export default createProtectedRoute;
