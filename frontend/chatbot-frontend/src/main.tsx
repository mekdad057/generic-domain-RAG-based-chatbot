import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Add this line at the top of the file
import "./styles/conversation.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
