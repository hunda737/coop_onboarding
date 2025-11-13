import { apiSlice } from "../api/apiSlice";

export type HighProfileCustomerResponse = {
  id: number;
  phone: string;
  accHolderName: string;
  address: string;
  tinNumber: string;
  accountNumber: number;
  assignedCRMName: string;
  gender: string;
  birthDate: string;
  maritalStatus: string;
  nationality: string;
  email: string;
  createdBy: string;
  updatedBy: string;
};

export type GetHighProfileCustomerRequest = { id: number };

export type CreateHighProfileCustomerRequest = {
  phone: string;
  accHolderName: string;
  accNumber: number;
  address: string;
  tinNumber: string;
  gender: "FEMALE" | "MALE";
  birthDate: string;
  maritalStatus: string;
  nationality: string;
  email: string;
};

export type UpdateHighProfileCustomerRequest = {
  phone: string;
  accHolderName: string;
  accNumber: number;
  address: string;
  tinNumber: string;
  gender: "FEMALE" | "MALE";
  birthDate: string;
  maritalStatus: string;
  nationality: string;
  email: string;
};

export type AssignCRMRequest = { hpcId: number; crmId: number };

export type BulkAssignCRMRequest = { crmId: number; body: number[] };

export type AssignCRMBulkResponse = {
  id: number;
  crm: {
    id: number;
    username: string;
    email: string;
    phone: string;
    fullName: string;
    status: string;
    business_name: string;
    business_type: string;
    tin_number: number;
    business_address: string;
    crmSegment: string;
    role: {
      id: number;
      roleName: string;
      status: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    };
    mainBranch: {
      id: number;
      branchCode: string;
      companyName: string;
      nameAddress: string;
      mnemonic: string;
      languageCode: string;
    };
    agentRegistrationSource: string;
    lastLoggedIn: string;
    createdAt: string;
    updatedAt: string;
    enabled: boolean;
    authorities: Array<{ authority: string }>;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
  };
  addedBy: {
    id: number;
    username: string;
    email: string;
    phone: string;
    fullName: string;
    status: string;
    business_name: string;
    business_type: string;
    tin_number: number;
    business_address: string;
    crmSegment: string;
    role: {
      id: number;
      roleName: string;
      status: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    };
    mainBranch: {
      id: number;
      branchCode: string;
      companyName: string;
      nameAddress: string;
      mnemonic: string;
      languageCode: string;
    };
    agentRegistrationSource: string;
    lastLoggedIn: string;
    createdAt: string;
    updatedAt: string;
    enabled: boolean;
    authorities: Array<{ authority: string }>;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
  };
  phone: string;
  accHolderName: string;
  accNumber: number;
  address: string;
  gender: string;
  birthDate: string;
  maritalStatus: string;
  nationality: string;
  email: string;
  tinNumber: string;
  createdAt: string;
  updatedAt: string;
};

// Define the API Slice
export const hpcApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch high-profile customers
    getHighProfileCustomers: builder.query<HighProfileCustomerResponse[], void>(
      {
        query: () => "/api/v1/high-profile-customers",
        providesTags: [{ type: "HPC", id: "HPC_LIST" }],
      }
    ),
    // Fetch high-profile customers by CRM
    getHighProfileCustomersByCRM: builder.query<
      HighProfileCustomerResponse[],
      number
    >({
      query: (crmId) => `/api/v1/high-profile-customers/crm/${crmId}`,
      providesTags: [{ type: "HPC", id: "HPC_LIST" }],
    }),
    // Fetch high-profile customers by logged-in CRM
    getHighProfileCustomersByCRMME: builder.query<
      HighProfileCustomerResponse[],
      void
    >({
      query: () => "/api/v1/high-profile-customers/by-crm/me",
      providesTags: [{ type: "HPC", id: "HPC_LIST" }],
    }),
    // Get a high-profile customer by ID
    getHighProfileCustomer: builder.query<
      HighProfileCustomerResponse,
      GetHighProfileCustomerRequest
    >({
      query: ({ id }) => `/api/v1/high-profile-customers/${id}`,
      providesTags: [{ type: "HPC", id: "HPC_LIST" }],
    }),
    // Create a high-profile customer
    createHighProfileCustomer: builder.mutation<
      HighProfileCustomerResponse,
      CreateHighProfileCustomerRequest
    >({
      query: (data) => ({
        url: "/api/v1/high-profile-customers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "HPC", id: "HPC_LIST" }],
    }),
    // Update a high-profile customer
    updateHighProfileCustomer: builder.mutation<
      HighProfileCustomerResponse,
      UpdateHighProfileCustomerRequest
    >({
      query: (data) => ({
        url: "/api/v1/high-profile-customers",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "HPC", id: "HPC_LIST" }],
    }),
    // Assign CRM to a high-profile customer
    assignCRM: builder.mutation<HighProfileCustomerResponse, AssignCRMRequest>({
      query: (data) => ({
        url: "/api/v1/high-profile-customers/assign-crm",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "HPC", id: "HPC_LIST" }],
    }),
    // Bulk assign CRM to high-profile customers
    bulkAssignCRM: builder.mutation<
      AssignCRMBulkResponse,
      BulkAssignCRMRequest
    >({
      query: ({ crmId, body }) => ({
        url: `/api/v1/high-profile-customers/assign-crm/bulk?crmId=${crmId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "HPC", id: "HPC_LIST" }],
    }),
  }),
});

export const {
  useGetHighProfileCustomersQuery,
  useGetHighProfileCustomersByCRMQuery,
  useGetHighProfileCustomersByCRMMEQuery,
  useGetHighProfileCustomerQuery,
  useCreateHighProfileCustomerMutation,
  useUpdateHighProfileCustomerMutation,
  useAssignCRMMutation,
  useBulkAssignCRMMutation,
} = hpcApiSlice;
