import { AppShell } from "@mantine/core";
import BottomNav from "@/components/layout/BottomNav";
import AnimatedOutlet from "./AnimatedOutlet";

const MainLayout = () => {
  return (
    <AppShell
      footer={{ height: { base: 70 } }}
      padding={{ base: "md", sm: "xl", lg: 40 }}
    >
      <AppShell.Main>
        <AnimatedOutlet />
      </AppShell.Main>

      <AppShell.Footer withBorder={false} bg="transparent">
        <BottomNav />
      </AppShell.Footer>
    </AppShell>
  );
};

export default MainLayout;
