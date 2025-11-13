import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VisitTarget, dummyVisitTargets } from "./visitTargetApiSlice";

interface VisitTargetState {
  targets: VisitTarget[];
}

const initialState: VisitTargetState = {
  targets: dummyVisitTargets,
};

const visitTargetSlice = createSlice({
  name: "visitTargets",
  initialState,
  reducers: {
    addTarget: (state, action: PayloadAction<VisitTarget>) => {
      state.targets.push(action.payload);
    },
  },
});

export const { addTarget } = visitTargetSlice.actions;

export default visitTargetSlice.reducer;
