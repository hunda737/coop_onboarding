import { apiSlice } from "../api/apiSlice";

export interface Login {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordWithTokenRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<LoginResponse, Login>({
      query: (userInfo) => ({
        url: "/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [{ type: "Auth" }],
    }),

    // Forgot Password
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password with Token
    resetPasswordWithToken: builder.mutation<void, ResetPasswordWithTokenRequest>({
      query: (data) => ({
        url: "/api/v1/auth/reset-password-with-token",
        method: "POST",
        body: data,
      }),
    }),

    // Change Password
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: "/api/v1/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordWithTokenMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
