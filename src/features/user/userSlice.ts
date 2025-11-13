import { RootState } from "@/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./userApiSlice";

type UserState = {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.userId === action.payload.userId
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(
        (user) => user.userId !== action.payload
      );
    },
  },
});

export const {
  setUsers,
  setCurrentUser,
  setLoading,
  setError,
  addUser,
  updateUser,
  deleteUser,
} = userSlice.actions;

// Selectors
export const selectUsers = (state: RootState) => state.user.users;
export const selectUserById = (state: RootState, id: number) =>
  state.user.users.find((user) => user.userId === id);
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
