import { apiSlice } from "../api/apiSlice";

export interface AccountFlowSettings {
  id: number;
  accountOrigin: string | null;
  documentStatus: string | null;
  customerType: string | null;
  targetStage: string;
  matchAllOrigins: boolean;
  matchAllDocuments: boolean;
  matchAllCustomerTypes: boolean;
  active: boolean;
  priority: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountFlowSettingsRequest {
  accountOrigin?: string | null;
  documentStatus?: string | null;
  customerType?: string | null;
  targetStage: string;
  matchAllOrigins?: boolean;
  matchAllDocuments?: boolean;
  matchAllCustomerTypes?: boolean;
  active?: boolean;
  priority?: number;
  description?: string;
}

export const accountFlowSettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET - Get all flow settings
    getAllFlowSettings: builder.query<AccountFlowSettings[], void>({
      query: () => "/api/account-flow-settings",
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "FlowSettings" as const, id })),
            { type: "FlowSettings", id: "FLOW_SETTINGS_LIST" },
          ]
          : [{ type: "FlowSettings", id: "FLOW_SETTINGS_LIST" }],
    }),

    // GET - Get only active flow settings
    getActiveFlowSettings: builder.query<AccountFlowSettings[], void>({
      query: () => "/api/account-flow-settings/active",
      providesTags: [{ type: "FlowSettings", id: "ACTIVE_FLOW_SETTINGS" }],
    }),

    // GET - Get single flow setting by ID
    getFlowSettingById: builder.query<AccountFlowSettings, number>({
      query: (id) => `/api/account-flow-settings/${id}`,
      providesTags: (_, __, id) => [{ type: "FlowSettings", id }],
    }),

    // POST - Create new flow setting
    createFlowSetting: builder.mutation<
      AccountFlowSettings,
      AccountFlowSettingsRequest
    >({
      query: (data) => ({
        url: "/api/account-flow-settings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "FlowSettings", id: "FLOW_SETTINGS_LIST" },
        { type: "FlowSettings", id: "ACTIVE_FLOW_SETTINGS" },
      ],
    }),

    // PUT - Update existing flow setting
    updateFlowSetting: builder.mutation<
      AccountFlowSettings,
      { id: number; data: AccountFlowSettingsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/account-flow-settings/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "FlowSettings", id },
        { type: "FlowSettings", id: "FLOW_SETTINGS_LIST" },
        { type: "FlowSettings", id: "ACTIVE_FLOW_SETTINGS" },
      ],
    }),

    // DELETE - Delete flow setting
    deleteFlowSetting: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/account-flow-settings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "FlowSettings", id },
        { type: "FlowSettings", id: "FLOW_SETTINGS_LIST" },
        { type: "FlowSettings", id: "ACTIVE_FLOW_SETTINGS" },
      ],
    }),

    // PATCH - Toggle isActive status
    toggleFlowSetting: builder.mutation<AccountFlowSettings, number>({
      query: (id) => ({
        url: `/api/account-flow-settings/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "FlowSettings", id },
        { type: "FlowSettings", id: "FLOW_SETTINGS_LIST" },
        { type: "FlowSettings", id: "ACTIVE_FLOW_SETTINGS" },
      ],
    }),
  }),
});

export const {
  useGetAllFlowSettingsQuery,
  useGetActiveFlowSettingsQuery,
  useGetFlowSettingByIdQuery,
  useCreateFlowSettingMutation,
  useUpdateFlowSettingMutation,
  useDeleteFlowSettingMutation,
} = accountFlowSettingsApiSlice;

