import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { secureAuth } from "@/lib/secureAuth";
import { useAuth } from "@/contexts/AuthContext";


const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { accessToken: contextToken, isTokenExpired } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure cookies are available after login
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Check authentication using both secure storage and context
  const storageToken = secureAuth.getAccessToken();
  const signedIn = !!(storageToken || contextToken);
  const tokenExpired = contextToken ? isTokenExpired() : true;

  // Show loading during initial check
  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!signedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (tokenExpired) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;