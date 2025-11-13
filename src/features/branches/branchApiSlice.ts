import { apiSlice } from "../api/apiSlice";

interface Branch {
  id: number;
  companyName: string;
  branchCode: string;
}

interface District {
  id: number;
  name: string;
}

export const branchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET - Get all branches
    getAllBranches: builder.query<Branch[], void>({
      query: () => ({
        url: "/api/branches",
      }),
      providesTags: [{ type: "Branches", id: "BRANCH_LIST" }],
    }),

    // GET - Get branches by district
    getBranchesByDistrict: builder.query<Branch[], string>({
      query: (district) => ({
        url: "/api/branches/by-district",
        params: { district },
      }),
      providesTags: [{ type: "Branches", id: "BRANCHES_BY_DISTRICT" }],
    }),

    // GET - Get all districts
    getAllDistricts: builder.query<District[], void>({
      query: () => ({
        url: "/api/district",
      }),
      providesTags: [{ type: "Districts", id: "DISTRICT_LIST" }],
    }),
  }),
});

export const {
  useGetAllBranchesQuery,
  useGetBranchesByDistrictQuery,
  useGetAllDistrictsQuery,
} = branchApiSlice;
export type { Branch, District };
