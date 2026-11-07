import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "./index.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme/index.ts";
import App from "./App.tsx";
import { Notifications } from "@mantine/notifications";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications
        position="top-right"
        zIndex={1000}
        styles={{
          root: {
            isolation: "isolate",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
          },
        }}
      />
      <App />
    </MantineProvider>
  </StrictMode>,
);
