import { apiSlice } from "../api/apiSlice";

// Interfaces for Request and Response
export interface Case {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  resolution: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  highProfileCustomerId: number;
  highProfileCustomerName: string;
  assignedToUserId: number;
  assignedToUserName: string;
  addedByUserId: number;
  addedByUserName: string;
}

export interface CreateCaseRequest {
  highProfileCustomerId: number;
  title: string;
  description: string;
  status: string; // Use "OPEN", "CLOSED", etc.
  priority: string; // Use "LOW", "MEDIUM", "HIGH", etc.
  assignedToUserId?: number;
  resolution: string;
  dueDate?: string; // Use "YYYY-MM-DD" format
}

export interface UpdateCaseRequest extends CreateCaseRequest {
  id: number; // Case ID
}

// Case API Slice
export const caseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. GET /api/v1/cases/{id}
    getCaseById: builder.query<Case, number>({
      query: (id) => ({
        url: `/api/v1/cases/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "Case", id }],
    }),

    // 2. PUT /api/v1/cases/{id}
    updateCase: builder.mutation<Case, UpdateCaseRequest>({
      query: ({ id, ...data }) => ({
        url: `/api/v1/cases/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Case", id }],
    }),

    // 3. DELETE /api/v1/cases/{id}
    deleteCase: builder.mutation<string, number>({
      query: (id) => ({
        url: `/api/v1/cases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Case", id: "CASE_LIST" }],
    }),

    // 4. GET /api/v1/cases
    getAllCases: builder.query<Case[], void>({
      query: () => ({
        url: "/api/v1/cases",
      }),
      providesTags: [{ type: "Case", id: "CASE_LIST" }],
    }),

    // 5. POST /api/v1/cases
    createCase: builder.mutation<Case, CreateCaseRequest>({
      query: (data) => ({
        url: "/api/v1/cases",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Case", id: "CASE_LIST" }],
    }),

    // 6. GET /api/v1/cases/me
    getMyCases: builder.query<Case[], void>({
      query: () => ({
        url: "/api/v1/cases/me",
      }),
      providesTags: [{ type: "Case", id: "CASE_LIST" }],
    }),
  }),
});

export const {
  useGetCaseByIdQuery,
  useUpdateCaseMutation,
  useDeleteCaseMutation,
  useGetAllCasesQuery,
  useCreateCaseMutation,
  useGetMyCasesQuery,
} = caseApiSlice;
