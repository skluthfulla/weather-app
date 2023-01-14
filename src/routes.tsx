import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./screens/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
]);

export default router;
