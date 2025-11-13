import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setAuthState, clearToken } from "@/features/auth/authSlice";
import { apiSlice } from "@/features/api/apiSlice";
import { secureAuth } from "@/lib/secureAuth";
import { useLogoutMutation } from "@/features/auth/authApiSlice";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (access: string, refresh: string) => void;
  logout: () => Promise<void>;
  isTokenExpired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize from secure storage (cookies only)
  const initialAccessToken = secureAuth.getAccessToken() || "";
  const initialRefreshToken = secureAuth.getRefreshToken() || "";

  const [accessToken, setAccessToken] = useState<string>(initialAccessToken);
  const [refreshToken, setRefreshToken] = useState<string>(initialRefreshToken);
  const dispatch = useAppDispatch();
  const [logoutFromServer] = useLogoutMutation();

  // Check if token is expired
  const isTokenExpired = () => {
    if (!accessToken) {
      return true;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(accessToken);
      const currentTime = Date.now() / 1000;
      const expired = decodedToken.exp ? decodedToken.exp < currentTime : true;
      return expired;
    } catch (error) {
      return true;
    }
  };

  // Auto-logout when token expires
  useEffect(() => {
    if (accessToken && isTokenExpired()) {
      logout();
    }
  }, [accessToken]);

  // Check token expiration every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken && isTokenExpired()) {
        logout();
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
    };
  }, [accessToken]);

  const login = (access: string, refresh: string) => {
    // First, ensure we're starting with a clean slate
    setAccessToken("");
    setRefreshToken("");
    dispatch(clearToken());
    dispatch(apiSlice.util.resetApiState());
    secureAuth.clearAuthTokens();

    // Now set new user data
    setAccessToken(access);
    setRefreshToken(refresh);

    const decodedData = jwtDecode<JwtPayload & { role?: string, clientId?: string }>(access);
    const role = decodedData?.role;
    const clientId = decodedData?.clientId;

    // Update Redux auth state
    dispatch(setAuthState({
      isAuthenticated: true,
      token: access
    }));

    // Use secure storage (cookies only, no localStorage)
    secureAuth.setAuthTokens(access, refresh);
    secureAuth.setAuthData(role, clientId);
  };

  const logout = async () => {
    try {
      // Call server logout API with current token
      await logoutFromServer().unwrap();
    } catch (error) {
      // Continue with client-side logout even if server call fails
    }

    // Clear client-side state
    setAccessToken("");
    setRefreshToken("");

    // Clear Redux auth state
    dispatch(clearToken());

    // CRITICAL: Clear RTK Query cache to prevent stale data between user sessions
    dispatch(apiSlice.util.resetApiState());

    // Clear secure storage (no localStorage usage)
    secureAuth.clearAuthTokens();

    // Force clear any remaining localStorage items (just in case)
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('role');
      localStorage.removeItem('clientId');
      localStorage.removeItem('persist:root'); // Clear any persisted Redux state
    } catch (error) {
      // Ignore localStorage errors
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};