import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/notFound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
