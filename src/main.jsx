import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/login.jsx";
import UserPage from "./pages/user/user.jsx";
import DashboardPage from "./pages/dashboard.jsx";
import EditUserPage from "./pages/user/editUser.jsx";
import MandatoryModal from "./pages/mandatory/mandatory.jsx";
import AttendancePage from "./pages/attendance/attendace.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      {
        path: "user",
        element: <UserPage />,
        children: [
          {
            path: "edit/:id",
            element: <EditUserPage />,
          },
          {
            path: "edit-madatory/:id",
            element: <MandatoryModal />,
          },
        ],
      },
      {
        path: "attendance",
        element: <AttendancePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
