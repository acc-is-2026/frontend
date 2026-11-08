import { AppShell } from "@mantine/core";
import AnimatedOutlet from "./AnimatedOutlet";

const AuthLayout = () => (
  <AppShell header={{ height: 50 }} padding="lg">
    <AppShell.Main>
      <AnimatedOutlet />
    </AppShell.Main>
  </AppShell>
);

export default AuthLayout;
