import { RootState } from "@/store";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Open = boolean;

const initialState: Open = false;

const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    setOpen: (_, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { setOpen } = exampleSlice.actions;

export const selectExample = (state: RootState) => state.example;

export default exampleSlice.reducer;
