import { apiSlice } from "../api/apiSlice";

interface Client {
  id: number;
  clientName: string;
  description: string;
  logo: string;
  clientCode: string;
  status: string;
  district: string;
  createdAt: string;
  updatedAt: string;
}

export const clientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST - Create a new client
    createClient: builder.mutation<Client, FormData>({
      query: (data) => ({
        url: "/api/v1/clients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Clients", id: "CLIENT_LIST" }],
    }),

    // GET - Get all clients
    getAllClients: builder.query<Client[], void>({
      query: () => "/api/v1/clients",
      providesTags: (result) =>
        result
          ? [
            ...result.map(
              ({ clientName }) =>
                ({ type: "Clients", id: clientName } as const)
            ),
            { type: "Clients", id: "CLIENT_LIST" },
          ]
          : [{ type: "Clients", id: "CLIENT_LIST" }],
    }),

    // PUT - Update client details
    updateClient: builder.mutation<Client, Partial<Client>>({
      query: (data) => ({
        url: "/api/v1/clients",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { clientName }) => [
        { type: "Clients", id: clientName },
      ],
    }),

    // PUT - Toggle client status
    toggleClientStatus: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/api/v1/clients/${id}/toggle-status`,
        method: "PUT",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Clients", id }],
    }),

    // GET - Get client by ID
    getClientById: builder.query<Client, string>({
      query: (id) => `/api/v1/clients/${id}`,
      providesTags: (_, __, id) => [{ type: "Clients", id }],
    }),
  }),
});

export const {
  useCreateClientMutation,
  useGetAllClientsQuery,
  useUpdateClientMutation,
  useToggleClientStatusMutation,
  useGetClientByIdQuery,
} = clientApiSlice;
export type { Client };
