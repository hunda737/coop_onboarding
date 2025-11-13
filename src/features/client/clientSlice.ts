import { RootState } from "@/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Client } from "./clientApiSlice";

type ClientState = {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ClientState = {
  clients: [],
  isLoading: false,
  error: null,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(
        (client) => client.clientName === action.payload.clientName
      );
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter(
        (client) => client.clientName !== action.payload
      );
    },
  },
});

export const {
  setClients,
  setLoading,
  setError,
  addClient,
  updateClient,
  deleteClient,
} = clientSlice.actions;

// Selectors
export const selectClients = (state: RootState) => state.client.clients;
export const selectClientById = (state: RootState, id: string) =>
  state.client.clients.find((client) => client.clientName === id);
export const selectClientLoading = (state: RootState) => state.client.isLoading;
export const selectClientError = (state: RootState) => state.client.error;

export default clientSlice.reducer;
