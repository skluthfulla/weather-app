import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes.tsx";
import { WeatherProvider } from "./context/weatherContext.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WeatherProvider>
      <RouterProvider router={router} />
    </WeatherProvider>
  </StrictMode>
);
