import { apiSlice } from "../api/apiSlice";

interface CRMUser {
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
  district: string;
}

interface CreateCRMUserRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  clientId: number;
  districtId: number;
  segment: string;
}

interface CRMParams {
  district?: string;
}

export const crmApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCRMUsers: builder.query<CRMUser[], CRMParams>({
      query: ({ district }) => ({
        url: "/api/v1/crm",
        params: { district },
      }),
      providesTags: [{ type: "Users", id: "CRM_LIST" }],
    }),

    createCRMUser: builder.mutation<CRMUser, CreateCRMUserRequest>({
      query: (userData) => ({
        url: "/api/v1/crm",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "Users", id: "CRM_LIST" }],
    }),
  }),
});

export const { useGetCRMUsersQuery, useCreateCRMUserMutation } = crmApiSlice;

export type { CRMUser, CreateCRMUserRequest };
