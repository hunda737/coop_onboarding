import { apiSlice } from "../api/apiSlice";

interface HeadersPageInfo {
  xPageNumber: number;
  xPageSize: number;
  xTotalElements: number;
  xTotalPages: number;
}

interface Approval {
  approvalStatus: string;
  approvedBy: string;
  reason: string;
  approvedAt: string;
}

interface Authorization {
  id: string;
  authorizedBy: string;
  authorizedAt: string;
}

interface BaseAccount {
  id: number;
  emailVerified: boolean;
  phone: string;
  initialDeposit: number;
  branch: string;
  status: string;
  accountType: string;
  currency: string;
  error: string;
  percentageComplete: number;
  createdAt: string;
  updatedAt: string;
  approvals: Approval[];
  authorizations: Authorization[];
  accountId: number;
  accountNumber: string;
  customerId: string;
}

export interface IndividualAccount extends BaseAccount {
  customerType: "INDIVIDUAL";
  fullName: string;
  surname: string;
  motherName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  occupation: string;
  monthlyIncome: number;
  addedByFullName: string;
  addedByRole: string;
  dateOfBirth: string;
  title: string;
  maritalStatus: string;
  postCode: number;

  zoneSubCity: string;
  houseNo: string;
  documentName: string;
  issueDate: string;
  expirayDate: string;
  salary: number;
  sector: string;
  industry: string;
  employerName: string;
  legalId: string;
  sex?: string;
  photo: string;
  signature: string;
  residenceCardBack: string;
  residenceCard: string;
  clientId: string;
  haveCboAccount?: boolean;
  customerUserInfo?: {
    id: number;
    fullName: string;
    gender: string;
    dateOfBirthStr: string;
    addressCountry: string;
    addressCity: string;
    externalAccounts: Array<{
      id: number;
      accountNumber: string;
      accountTitle: string;
      coCode: string;
      branchName: string;
      createdAt: string;
      updatedAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}

interface JointCustomerInfo {
  id: number;
  fullName: string;
  surname: string;
  motherName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  occupation: string;
  monthlyIncome: number;
  sex: string;
  dateOfBirth: string;
  title: string;
  maritalStatus: string;
  postCode: number;
  zoneSubCity: string;
  houseNo: string;
  documentName: string;
  issueAuthority: string;
  issueDate: string;
  expirayDate: string;
  employeeStatus: string;
  salary: number;
  sector: string;
  industry: string;
  employerName: string;
  legalId: string;
  percentageComplete: number;
  createdAt: string;
  updatedAt: string;
  approvals: Approval[];
  authorizations: Authorization[];
}

export interface JointAccount extends BaseAccount {
  customerType: "JOINT";
  addedByFullName: string;
  addedByRole: string;
  customersInfo: JointCustomerInfo[];
}

interface OrganizationalCustomerInfo {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  percentageComplete: number;
  createdAt: string;
  updatedAt: string;
  approvals: Approval[];
  authorizations: Authorization[];
}

export interface OrganizationalAccount extends BaseAccount {
  customerType: "ORGANIZATION";
  companyName: string;
  companyEmail: string;
  companyPhoneNumber: string;
  companyTinNumber: string;
  companyTarget: string;
  companyResidence: string;
  companyState: string;
  companyZone: string;
  companySubCity: string;
  companyWoreda: string;
  customersInfo: OrganizationalCustomerInfo[];
}

export type Account = IndividualAccount | JointAccount | OrganizationalAccount;

export const accountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllIndividualAccounts: builder.query<
      { data: IndividualAccount[]; headers: HeadersPageInfo },
      { values: string; clientId: string }
    >({
      query: ({ values, clientId }) => {
        const queryParameters = new URLSearchParams({
          sortBy: "percentage_completed",
          size: "1000",
          sortDirection: "desc",
          clientId,
        });

        if (values === "include") {
          queryParameters.append("status", "INITIAL");
        } else if (values === "exclude") {
          queryParameters.append("statusToExclude", "INITIAL");
        }

        return {
          url: `/api/v1/accounts/individual?${queryParameters.toString()}`,
        };
      },
      providesTags: [{ type: "Accounts", id: "INDIVIDUAL_ACCOUNT_LIST" }],
      transformResponse: (response: IndividualAccount[], meta: any) => ({
        data: response,
        headers: {
          xPageNumber: Number(meta?.response?.headers.get("x-page-number")),
          xPageSize: Number(meta?.response?.headers.get("x-page-size")),
          xTotalElements: Number(
            meta?.response?.headers.get("x-total-elements")
          ),
          xTotalPages: Number(meta?.response?.headers.get("x-total-pages")),
        },
      }),
    }),


    getAllJointAccounts: builder.query<
      { data: JointAccount[]; headers: HeadersPageInfo },
      { values: string; clientId: string }
    >({
      query: ({ values, clientId }) => {
        const queryParameters = new URLSearchParams({
          sortBy: "percentage_completed",
          size: "1000",
          sortDirection: "desc",
          clientId,
        });

        if (values === "include") {
          queryParameters.append("status", "INITIAL");
        } else if (values === "exclude") {
          queryParameters.append("statusToExclude", "INITIAL");
        }

        return {
          url: `/api/v1/accounts/joint?${queryParameters.toString()}`,
        };
      },
      providesTags: [{ type: "Accounts", id: "JOINT_ACCOUNT_LIST" }],
      transformResponse: (response: JointAccount[], meta: any) => ({
        data: response,
        headers: {
          xPageNumber: Number(meta?.response?.headers.get("x-page-number")),
          xPageSize: Number(meta?.response?.headers.get("x-page-size")),
          xTotalElements: Number(
            meta?.response?.headers.get("x-total-elements")
          ),
          xTotalPages: Number(meta?.response?.headers.get("x-total-pages")),
        },
      }),
    }),

    getAllOrganizationalAccounts: builder.query<
      { data: OrganizationalAccount[]; headers: HeadersPageInfo },
      { values: string; clientId: string }
    >({
      query: ({ values, clientId }) => {
        const queryParameters = new URLSearchParams({
          sortBy: "percentage_completed",
          size: "1000",
          sortDirection: "desc",
          clientId,
        });

        if (values === "include") {
          queryParameters.append("status", "INITIAL");
        } else if (values === "exclude") {
          queryParameters.append("statusToExclude", "INITIAL");
        }

        return {
          url: `/api/v1/accounts/organizational?${queryParameters.toString()}`,
        };
      },
      providesTags: [{ type: "Accounts", id: "ORGANIZATIONAL_ACCOUNT_LIST" }],
      transformResponse: (response: OrganizationalAccount[], meta: any) => ({
        data: response,
        headers: {
          xPageNumber: Number(meta?.response?.headers.get("x-page-number")),
          xPageSize: Number(meta?.response?.headers.get("x-page-size")),
          xTotalElements: Number(meta?.response?.headers.get("x-total-elements")),
          xTotalPages: Number(meta?.response?.headers.get("x-total-pages")),
        },
      }),
    }),
    getAllAccounts: builder.query<
      { data: Account[]; headers: HeadersPageInfo },
      { values: string; clientId: string }
    >({
      query: ({ values, clientId }) => {
        const queryParameters = new URLSearchParams({
          sortBy: "percentage_completed",
          size: "1000",
          sortDirection: "desc",
          clientId,
        });

        if (values === "include") {
          queryParameters.append("status", "INITIAL");
        } else if (values === "exclude") {
          queryParameters.append("statusToExclude", "INITIAL");
        }

        return {
          url: `/api/v1/accounts?${queryParameters.toString()}`,
        };
      },
      providesTags: [{ type: "Accounts", id: "ALL_ACCOUNTS_LIST" }],
      transformResponse: (response: Account[], meta: any) => ({
        data: response,
        headers: {
          xPageNumber: Number(meta?.response?.headers.get("x-page-number")),
          xPageSize: Number(meta?.response?.headers.get("x-page-size")),
          xTotalElements: Number(meta?.response?.headers.get("x-total-elements")),
          xTotalPages: Number(meta?.response?.headers.get("x-total-pages")),
        },
      }),
    }),


    getIndividualAccountById: builder.query<IndividualAccount, string>({
      query: (id) => `/api/v1/accounts/individual/${id}`,
      providesTags: (_, __, id) => [{ type: "Accounts", id }],
    }),

    getJointAccountById: builder.query<JointAccount, string>({
      query: (id) => `/api/v1/accounts/joint/${id}`,
      providesTags: (_, __, id) => [{ type: "Accounts", id }],
    }),

    getOrganizationalAccountById: builder.query<OrganizationalAccount, string>({
      query: (id) => `/api/v1/accounts/organizational/${id}`,
      providesTags: (_, __, id) => [{ type: "Accounts", id }],
    }),

    updateIndividualAccount: builder.mutation<
      IndividualAccount,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/api/v1/accounts/individual/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Accounts", id }],
    }),


    updateJointAccount: builder.mutation<
      JointAccount,
      { id: string; updatedData: Partial<JointAccount> }
    >({
      query: ({ id, updatedData }) => {
        const formData = new FormData();
        Object.entries(updatedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        return {
          url: `/api/v1/accounts/joint/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (_, __, { id }) => [{ type: "Accounts", id }],
    }),

    updateOrganizationalAccount: builder.mutation<
      OrganizationalAccount,
      { id: string; updatedData: Partial<OrganizationalAccount> }
    >({
      query: ({ id, updatedData }) => {
        const formData = new FormData();
        Object.entries(updatedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        return {
          url: `/api/v1/accounts/organizational/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (_, __, { id }) => [{ type: "Accounts", id }],
    }),

    deleteAccount: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/api/v1/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Accounts", id: "ACCOUNT_LIST" }],
    }),

    changeAccountStatus: builder.mutation<
      boolean,
      { id: string; status: string; rejectionReason?: string }
    >({
      query: ({ id, status, rejectionReason }) => ({
        url: `/api/v1/accounts/${id}/update-status?status=${status}`,
        method: "PUT",
        body: rejectionReason,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Accounts", id }],
    }),

    settleAccount: builder.mutation<
      any,
      {
        accountIds: number;  // Single number (not array)
        referenceNumber: string
      }
    >({
      query: (data) => ({
        url: `/api/v1/accounts/settle-account`,
        method: "PUT",
        body: data, // Send the exact object structure
      }),
      invalidatesTags: [{ type: "Accounts", id: "ACCOUNT_LIST" }],
    }),



    bulkSettleAccounts: builder.mutation<
      any, // <-- change this from `boolean` to `any` or better: to the actual expected return type
      { selectedAccountIds: number[]; referenceNumber: string }
    >({
      query: (payload) => ({
        url: "/api/v1/accounts/bulk-settle-account",
        method: "PUT",
        body: {
          accountIds: payload.selectedAccountIds,
          referenceNumber: payload.referenceNumber,
        },
      }),
      invalidatesTags: [{ type: "Accounts", id: "ACCOUNT_LIST" }],
    }),


    verifyAccount: builder.mutation<any, { accountId: number }>({
      query: ({ accountId }) => ({
        url: `/api/v1/accounts/${accountId}/verify-account`,
        method: "PUT",
      }),
      invalidatesTags: (_, __, { accountId }) => [
        { type: "Accounts", id: accountId },
        { type: "Accounts", id: "LIST" },
      ],
    }),

    authorizeAccount: builder.mutation<
      { success: boolean; message?: string },
      { accountId: number }
    >({
      query: ({ accountId }) => ({
        url: `/api/v1/accounts/${accountId}/authorize-account`,
        method: "PUT",
      }),
      async onQueryStarted({ accountId }, { dispatch, queryFulfilled }) {
        // Automatically refetch queries after successful mutation
        // This is RTK Query's equivalent to React Query's automatic refetch
        try {
          await queryFulfilled;
          // Invalidate all relevant tags to trigger automatic refetch
          dispatch(
            apiSlice.util.invalidateTags([
              { type: "Accounts", id: String(accountId) },
              { type: "Accounts", id: "LIST" },
              { type: "Accounts", id: "INDIVIDUAL_ACCOUNT_LIST" },
              { type: "Accounts", id: "JOINT_ACCOUNT_LIST" },
              { type: "Accounts", id: "ORGANIZATIONAL_ACCOUNT_LIST" },
              { type: "Accounts", id: "ALL_ACCOUNTS_LIST" },
            ])
          );
        } catch {
          // Error handling is done by the mutation itself
        }
      },
    }),

    rejectAuthorization: builder.mutation<
      { success: boolean; message?: string },
      { accountId: number; reason: string }
    >({
      query: ({ accountId, reason }) => ({
        url: `/api/v1/accounts/${accountId}/reject-authorize-account`,
        method: "PUT",
        params: { reason },
      }),
      invalidatesTags: (_, __, { accountId }) => [

        { type: "Accounts", id: accountId },
        { type: "Accounts", id: "LIST" },
      ],
    }),

    // In your accountApiSlice configuration
    updateAccountStatus: builder.mutation<
      boolean,
      { accountId: number; status: string }  // Changed to use accountId as number
    >({
      query: ({ accountId, status }) => ({
        url: `/api/v1/accounts/${accountId}/update-status`,
        method: "PUT",
        params: { status },  // Send status as query parameter
        headers: {
          "Content-Type": "application/json"  // Explicit content type
        }
      }),
      invalidatesTags: (_, __, { accountId }) => [

        { type: "Accounts", id: accountId },
        { type: "Accounts", id: "LIST" }
      ]
    }),

    // Add a separate approval mutation if needed
    approveAccount: builder.mutation<
      IndividualAccount,
      { accountId: number }


    >({
      query: ({ accountId }) => ({
        url: `/api/v1/accounts/${accountId}/update-status?status=APPROVED`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      }),
      invalidatesTags: (_, __, { accountId }) => [

        { type: "Accounts", id: accountId },
        { type: "Accounts", id: "LIST" }
      ]
    }),

    reverseAuthorization: builder.mutation<boolean, { accountId: number }>({
      query: ({ accountId }) => ({
        url: `/api/v1/accounts/${accountId}/reverseAuthorization`,
        method: "PUT",  // No body is needed here
      }),
    }),

    updateCustomerInfo: builder.mutation<
      any,
      { accountId: number }
    >({
      query: ({ accountId }) => ({
        url: `/api/v1/accounts/update-customer-info/${accountId}`,
        method: "PUT",
      }),
      invalidatesTags: (_, __, { accountId }) => [
        { type: "Accounts", id: accountId },
        { type: "Accounts", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useGetAllIndividualAccountsQuery,
  useGetAllJointAccountsQuery,
  useGetAllOrganizationalAccountsQuery,
  useGetIndividualAccountByIdQuery,
  useGetJointAccountByIdQuery,
  useGetOrganizationalAccountByIdQuery,
  useUpdateIndividualAccountMutation,
  useUpdateJointAccountMutation,
  useUpdateOrganizationalAccountMutation,
  useDeleteAccountMutation,
  useChangeAccountStatusMutation,
  useSettleAccountMutation,
  useBulkSettleAccountsMutation,
  useUpdateAccountStatusMutation,
  useReverseAuthorizationMutation,
  useVerifyAccountMutation,
  useAuthorizeAccountMutation,
  useRejectAuthorizationMutation,
  useApproveAccountMutation,
  useGetAllAccountsQuery,
  useUpdateCustomerInfoMutation
} = accountApiSlice;

export type { Approval, HeadersPageInfo };