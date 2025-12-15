import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { setAuthState, clearToken } from "../auth/authSlice";
import { secureAuth } from "@/lib/secureAuth";

const baseQuery = fetchBaseQuery({
  // baseUrl: "/api",
  // baseUrl: "http://10.12.53.56:9062",

  // baseUrl: "http://10.8.100.111:9061",
  // baseUrl: "https://10.12.53.33:9061",
  baseUrl: "http://localhost:9061",
  //  baseUrl: "https://coopengage.coopbankoromiasc.com",
  prepareHeaders: (headers) => {
    // Get token from secure storage (cookies only)
    const token = secureAuth.getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Enhanced base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 error, try to refresh the token
  if (result.error && result.error.status === 401) {
    // Get refresh token from secure storage
    const refreshToken = secureAuth.getRefreshToken();

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: '/refresh-token',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Extract new tokens from response
        const { access_token: newAccessToken, refresh_token: newRefreshToken } = refreshResult.data as any;

        // Update Redux state
        api.dispatch(setAuthState({
          isAuthenticated: true,
          token: newAccessToken
        }));

        // Update secure storage
        secureAuth.setAuthTokens(newAccessToken, newRefreshToken);

        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, log out user
        api.dispatch(clearToken());

        // Clear secure storage
        secureAuth.clearAuthTokens();

        // Redirect to login
        window.location.href = '/sign-in';
      }
    } else {
      // No refresh token, log out user
      api.dispatch(clearToken());
      window.location.href = '/sign-in';
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Examples",
    "Clients",
    "Users",
    "Agents",
    "Accounts",
    "Branches",
    "Districts",
    "Targets",
    "Roles",
    "Auth",
    "Meeting",
    "HPC",
    "Case",
    "Lead",
    "Task",
    "RTGS",
    "FlowSettings",
    "Harmonization",
  ],
  endpoints: () => ({}),
});
