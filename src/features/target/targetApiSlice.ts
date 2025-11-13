import { apiSlice } from "../api/apiSlice";

interface BranchTarget {
  id: number;
  accountOnboarding: number;
  agentRegistration: number;
  inactiveAccount: number;
  year: number;
  month: string;
  targetType: string;
  branch: string;
  district: string;
}

interface BranchTargetRequest {
  branchId?: number;
  districtId?: number;
  accountOnboarding: number;
  agentRegistration: number;
  inactiveAccount: number;
  year: number;
  month: string;
  targetType: string;
}
interface BranchParams {
  branchId?: number;
  districtId?: number;
  year?: number;
  month?: string;
}

export const agentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranchTargets: builder.query<BranchTarget[], BranchParams>({
      query: ({ branchId, districtId, year, month }) => ({
        url: "/api/branch-target",
        params: { branchId, districtId, year, month },
      }),
      providesTags: [{ type: "Targets", id: "TARGET_LIST" }],
    }),

    getMyTargets: builder.query<BranchTarget[], BranchParams>({
      query: ({ branchId, districtId, year, month }) => ({
        url: "/api/branch-target/me",
        params: { branchId, districtId, year, month },
      }),
      providesTags: [{ type: "Targets", id: "TARGET_LIST" }],
    }),

    createBranchTarget: builder.mutation<BranchTarget, BranchTargetRequest>({
      query: (targetData) => ({
        url: "/api/branch-target",
        method: "POST",
        body: targetData,
      }),
      invalidatesTags: [{ type: "Targets", id: "TARGET_LIST" }],
    }),

    createBranchTargetsBulk: builder.mutation<
      BranchTarget[],
      BranchTargetRequest[]
    >({
      query: (bulkData) => ({
        url: "/api/branch-target/bulk",
        method: "POST",
        body: bulkData,
      }),
      invalidatesTags: [{ type: "Targets", id: "TARGET_LIST" }],
    }),

    createBulkSameTarget: builder.mutation<
      BranchTarget[],
      {
        districtId?: number | null;
        branchIds?: number[];
        accountOnboarding: number;
        agentRegistration: number;
        inactiveAccount: number;
        year: number;
        months: string[];
      }
    >({
      query: (sameTargetData) => ({
        url: "/api/branch-target/bulk-same-target",
        method: "POST",
        body: sameTargetData,
      }),
      invalidatesTags: [{ type: "Targets", id: "TARGET_LIST" }],
    }),
  }),
});

export const {
  useGetBranchTargetsQuery,
  useGetMyTargetsQuery,
  useCreateBranchTargetMutation,
  useCreateBranchTargetsBulkMutation,
  useCreateBulkSameTargetMutation,
} = agentApiSlice;
export type { BranchTarget, BranchTargetRequest };
