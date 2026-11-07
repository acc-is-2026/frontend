import { createBrowserRouter } from "react-router-dom";
import NotFound from "@/pages/notFound/NotFound";

const router = createBrowserRouter([
  { path: "*", element: <NotFound /> },
]);

export default router;
