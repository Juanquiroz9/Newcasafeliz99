import React from "react";
import ReactDOM from "react-dom/client";
import CasaFeliz from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CasaFeliz />
    </AuthProvider>
  </React.StrictMode>
);
