import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import { apiSlice } from "./features/api/apiSlice";
import exampleReducer from "./features/example/exampleSlice";
import clientReducer from "./features/client/clientSlice";
import userReducer from "./features/user/userSlice";
import authReducer from "./features/auth/authSlice";
import visitTargetReducer from "./features/visit-target/visitTargetSlice";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    example: exampleReducer,
    client: clientReducer,
    user: userReducer,
    visitTargets: visitTargetReducer,
    auth: authReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
