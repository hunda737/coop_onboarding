// AppShell.tsx
import { useIdleLogout } from "@/hooks/useIdleLogout";
import { RouterProvider } from "react-router-dom";
import router from "@/routes/Router";

const AppShell = () => {
  useIdleLogout(15); // Logout after 15 minutes of inactivity
  return <RouterProvider router={router} />;
};

export default AppShell;
