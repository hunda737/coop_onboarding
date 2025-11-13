import { apiSlice } from "../api/apiSlice";

// Interfaces for Request and Response
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: string;
  interest: string;
  status: string;
  notes: string;
  highProfileCustomerId: number;
  highProfileCustomerName: string;
  assignedToUserId: number;
  assignedToUserName: string;
  addedById: number;
  addedByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  highProfileCustomerId: number;
  name: string;
  email?: string;
  phone: string;
  source: "REFERRAL" | "AD" | "EVENT";
  interest: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
  assignedToUserId?: number;
  notes: string;
}

export interface UpdateLeadRequest extends CreateLeadRequest {
  id: number; // Lead ID
}

// Lead API Slice
export const leadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET /api/v1/leads/{id}
    getLeadById: builder.query<Lead, number>({
      query: (id) => ({
        url: `/api/v1/leads/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "Lead", id }],
    }),

    // 2. PUT /api/v1/leads/{id}
    updateLead: builder.mutation<Lead, UpdateLeadRequest>({
      query: ({ id, ...data }) => ({
        url: `/api/v1/leads/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Lead", id }],
    }),

    // 3. DELETE /api/v1/leads/{id}
    deleteLead: builder.mutation<string, number>({
      query: (id) => ({
        url: `/api/v1/leads/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Lead", id: "LEAD_LIST" }],
    }),

    // 4. GET /api/v1/leads
    getAllLeads: builder.query<Lead[], void>({
      query: () => ({
        url: "/api/v1/leads",
      }),
      providesTags: [{ type: "Lead", id: "LEAD_LIST" }],
    }),

    // 5. POST /api/v1/leads
    createLead: builder.mutation<Lead, CreateLeadRequest>({
      query: (data) => ({
        url: "/api/v1/leads",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Lead", id: "LEAD_LIST" }],
    }),

    // 6. GET /api/v1/leads/me
    getMyLeads: builder.query<Lead[], void>({
      query: () => ({
        url: "/api/v1/leads/me",
      }),
      providesTags: [{ type: "Lead", id: "LEAD_LIST" }],
    }),
  }),
});

export const {
  useGetLeadByIdQuery,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetAllLeadsQuery,
  useCreateLeadMutation,
  useGetMyLeadsQuery,
} = leadApiSlice;
