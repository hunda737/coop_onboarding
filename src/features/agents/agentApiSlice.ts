import { apiSlice } from "../api/apiSlice";

interface Agent {
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
  branches: Array<{
    id: number;
    name: string;
    branchCode: string;
  }>;
  mainBranch: {
    id: number;
    name: string;
    branchCode: string;
  };
}

interface AgentRequest {
  fullName: string;
  email: string;
  branchIds: number[] | undefined;
  status?: string;
  userId?: number;
  phone?: string;
  password: string;
  mainBranchId?: number;
  business_name?: string;
  business_type?: string;
  tin_number?: number;
  business_address?: string;
}

interface AgentRequestID {
  clientId?: string;
}

export const agentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET - Get all agents
    getAgents: builder.query<Agent[], AgentRequestID>({
      query: (data) => `/api/v1/agents?clientId=${data.clientId}`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(
              ({ userId }) => ({ type: "Agents", id: userId } as const)
            ),
            { type: "Agents", id: "AGENT_LIST" },
          ]
          : [{ type: "Agents", id: "AGENT_LIST" }],
    }),

    // POST - Create a new agent
    createAgent: builder.mutation<Agent, AgentRequest>({
      query: (data) => ({
        url: `/api/v1/agents`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Agents", id: "AGENT_LIST" }],
    }),

    // PUT - Update agent details
    updateAgent: builder.mutation<Agent, Partial<AgentRequest>>({
      query: (data) => ({
        url: `/api/v1/agents`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: "Agents", id: userId }],
    }),

    // GET - Get an agent by ID
    getAgentById: builder.query<Agent, string>({
      query: (id) => `/api/v1/agents/${id}`,
      providesTags: (_, __, id) => [{ type: "Agents", id }],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useGetAgentByIdQuery,
} = agentApiSlice;
export type { Agent };
