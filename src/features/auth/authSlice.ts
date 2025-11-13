import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

interface AuthState {
  isAuthenticated: boolean;

  token: string | null; 
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<{ 
      isAuthenticated: boolean; 
      token?: string 
    }>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      if (action.payload.token !== undefined) {
        state.token = action.payload.token;
      }
    },
    // Keep clearToken for logout functionality
    clearToken: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

// New selector to check authentication status
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectToken = (state: RootState) => state.auth.token;

export const { setAuthState, clearToken } = authSlice.actions;
export default authSlice.reducer;