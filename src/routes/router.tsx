import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/notFound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
