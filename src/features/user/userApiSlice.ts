import { apiSlice, baseUrl } from "../api/apiSlice";
import { secureAuth } from "@/lib/secureAuth";

interface User {
  userId: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLoggedIn: string;
  registeredAt: string;
  registeredBy: string;
  updatedAt: string;
  client: {
    id: number;
    name: string;
    description: string;
  };
  branches: Array<{
    id: number;
    name: string;
    branchCode: string;
  }>;
  mainBranch: {
    id: number;
    name: string;
    branchCode: string;
  };
}

type UserRequest = {
  fullName?: string;
  email: string;
  password?: string;
  roleId: number;
  clientId: number;
  branchIds: number[] | [];
  mainBranchId: number;
};

type AdminUserUpdateReq = {
  userId: number;
  roleId?: number;
  mainBranchId?: number | null;
  status?: "PENDING" | "ACTIVE" | "BANNED";
};

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET - Get all users for a specific client
    getUsersByClientId: builder.query<User[], string>({
      query: (clientId) => `/api/v1/users?clientId=${clientId}`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(
              ({ userId }) => ({ type: "Users", id: userId } as const)
            ),
            { type: "Users", id: "USER_LIST" },
          ]
          : [{ type: "Users", id: "USER_LIST" }],
    }),

    getKycUsers: builder.query<User[], void>({
      query: () => `/api/v1/users/kyc`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(
              ({ userId }) => ({ type: "Users", id: userId } as const)
            ),
            { type: "Users", id: "KYC_USER_LIST" },
          ]
          : [{ type: "Users", id: "KYC_USER_LIST" }],
    }),

    // POST - Create a new user
    createUser: builder.mutation<User, UserRequest>({
      query: (data) => ({
        url: "/api/v1/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Users", id: "USER_LIST" },
        { type: "Users", id: "KYC_USER_LIST" },
      ],
    }),

    // PUT - Update user details
    updateUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "/api/v1/users",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: "Users", id: userId }],
    }),

    // PUT - Admin update user
    adminUpdateUser: builder.mutation<User, AdminUserUpdateReq>({
      query: (data) => ({
        url: "/api/v1/users/admin-update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "USER_LIST" },
        { type: "Users", id: "KYC_USER_LIST" },
      ],
    }),

    // GET - Get current user (self) details
    getCurrentUser: builder.query<User, void>({
      query: () => "/api/v1/users/me",
      providesTags: [{ type: "Users", id: "CURRENT_USER" }],
    }),

    // GET - Export users data (returns Excel file)
    exportUsersData: builder.query<Blob, void>({
      queryFn: async () => {
        const token = secureAuth.getAccessToken();
        
        try {
          const response = await fetch(
            `${baseUrl}/api/v1/users/export`,
            {
              headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text().catch(() => "Failed to export data");
            return { 
              error: { 
                status: response.status, 
                data: errorText 
              } as any
            };
          }

          const blob = await response.blob();
          return { data: blob };
        } catch (error) {
          return { 
            error: { 
              status: 'FETCH_ERROR' as const, 
              error: error instanceof Error ? error.message : "Failed to export data" 
            } as any
          };
        }
      },
    }),
  }),
});

export const {
  useGetUsersByClientIdQuery,
  useGetKycUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useAdminUpdateUserMutation,
  useGetCurrentUserQuery,
  useLazyExportUsersDataQuery,
} = userApiSlice;
export type { User, AdminUserUpdateReq };
