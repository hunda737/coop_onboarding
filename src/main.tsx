// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./contexts/AuthContext";
import { CookiesProvider } from "react-cookie"; // Import the CookiesProvider
import AppShell from "./components/SesssionTimeout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CookiesProvider> {/* Wrap with CookiesProvider */}
        <AuthProvider>
          <AppShell /> {/* 👈 Moved RouterProvider inside this */}
        </AuthProvider>
      </CookiesProvider>
    </Provider>
  </StrictMode>
);