import { apiSlice } from "../api/apiSlice";

// Interfaces for RTGS Request and Response
export interface RTGSRequest {
  id: number; // Unique identifier for the request
  branch: string;
  type: string;
  bank: string;
  amount: number;
  contact: string;
  registeredAt?: string;
}

export interface CreateRTGSRequest {
  branch: string;
  type: string;
  bank: string;
  amount: number;
  contact: string;
}

export interface UpdateRTGSRequest {
  id: number;
  branch?: string;
  type?: string;
  bank?: string;
  amount?: number;
  contact?: string;
}

export interface DeleteRTGSRequest {
  id: number;
}

// Dummy Data for RTGS Requests
let dummyRTGSRequests: RTGSRequest[] = [
  {
    id: 1,
    branch: "Main Branch",
    type: "Outgoing",
    bank: "Sinke Bank",
    amount: 1000000,
    contact: "0923124215",
    registeredAt: "11/20/2024",
  },
  {
    id: 1,
    branch: "Main Branch",
    type: "Incoming",
    bank: "Sinke Bank",
    amount: 500000,
    contact: "0923124215",
    registeredAt: "11/20/2024",
  },
  {
    id: 2,
    branch: "East Branch",
    type: "Incoming",
    bank: "Wegagen Bank",
    amount: 1000000,
    contact: "0921456789",
    registeredAt: "11/23/2024",
  },
  {
    id: 3,
    branch: "West Branch",
    type: "Outgoing",
    bank: "Dashen Bank",
    amount: 500000,
    contact: "0912345678",
    registeredAt: "11/24/2024",
  },
  {
    id: 4,
    branch: "Ijoo Branch",
    type: "Incoming",
    bank: "Bank of Abyssinia",
    amount: 1000000,
    contact: "0919876543",
    registeredAt: "11/25/2024",
  },
  {
    id: 41,
    branch: "South Branch",
    type: "Outgoing",
    bank: "Bank of Abyssinia",
    amount: 500000,
    contact: "0919876543",
    registeredAt: "11/25/2024",
  },
  {
    id: 42,
    branch: "Rwanda Branch",
    type: "Outgoing",
    bank: "Bank of Abyssinia",
    amount: 500000,
    contact: "0919876543",
    registeredAt: "11/25/2024",
  },
  {
    id: 5,
    branch: "North Branch",
    type: "Outgoing",
    bank: "Awash International Bank",
    amount: 2000000,
    contact: "0934567890",
    registeredAt: "02/23/2024",
  },
];

// console.log(Object.isExtensible(dummyRTGSRequests)); // Should log true

export const rtgsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all RTGS Requests
    getRTGSRequests: builder.query<RTGSRequest[], void>({
      queryFn: () => ({ data: dummyRTGSRequests }),
      providesTags: [{ type: "RTGS", id: "RTGS_LIST" }],
    }),

    // Add new RTGS Request
    createRTGSRequest: builder.mutation<RTGSRequest, CreateRTGSRequest>({
      queryFn: (newRequest) => {
        // console.log("nwq", newRequest);

        // console.log(Object.isExtensible(dummyRTGSRequests)); // Should log true
        // console.log(Object.isExtensible(newRequest)); // Check if it's extensible

        const newId = dummyRTGSRequests.length
          ? Math.max(...dummyRTGSRequests.map((req) => req.id)) + 1
          : 1;
        const createdRequest = {
          id: newId,
          ...JSON.parse(JSON.stringify(newRequest)),
          registeredAt: new Date().toLocaleDateString("en-US"),
        };

        // Create a new array to avoid mutating the original object
        dummyRTGSRequests = [...dummyRTGSRequests, createdRequest];

        return { data: createdRequest };
      },
      invalidatesTags: [{ type: "RTGS", id: "RTGS_LIST" }],
    }),

    // Update an RTGS Request
    updateRTGSRequest: builder.mutation<RTGSRequest, UpdateRTGSRequest>({
      queryFn: ({ id, ...updatedFields }) => {
        const index = dummyRTGSRequests.findIndex((req) => req.id === id);
        if (index === -1) return { error: { status: 404, data: "Not Found" } };
        dummyRTGSRequests[index] = {
          ...dummyRTGSRequests[index],
          ...updatedFields,
        };
        return { data: dummyRTGSRequests[index] };
      },
      invalidatesTags: [{ type: "RTGS", id: "RTGS_LIST" }],
    }),

    // Delete an RTGS Request
    deleteRTGSRequest: builder.mutation<void, DeleteRTGSRequest>({
      queryFn: ({ id }) => {
        const index = dummyRTGSRequests.findIndex((req) => req.id === id);
        if (index === -1) return { error: { status: 404, data: "Not Found" } };
        dummyRTGSRequests.splice(index, 1);
        return { data: undefined };
      },
      invalidatesTags: [{ type: "RTGS", id: "RTGS_LIST" }],
    }),
  }),
});

export const {
  useGetRTGSRequestsQuery,
  useCreateRTGSRequestMutation,
  useUpdateRTGSRequestMutation,
  useDeleteRTGSRequestMutation,
} = rtgsApiSlice;
