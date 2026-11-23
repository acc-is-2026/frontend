import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { useAppSync } from "./hooks/useAppSync";

function App() {
  useAppSync();

  return <RouterProvider router={router} />;
}

export default App;
