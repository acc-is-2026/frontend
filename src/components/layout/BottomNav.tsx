import { Group, Stack, UnstyledButton, Text } from "@mantine/core";
import { IconHome, IconList, IconSearch, IconUser } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import classes from "./BottomNav.module.css";
import { useMediaQuery } from "@mantine/hooks";

const BottomNav = () => {
  const location = useLocation();
  const showLabels = useMediaQuery("(min-width: 28em)");

  const navItems = [
    { icon: IconHome, label: "Home", path: "/" },
    { icon: IconSearch, label: "Search", path: "/search" },
    { icon: IconList, label: "Watchlist", path: "/watchlist" },
    { icon: IconUser, label: "Profile", path: "/profile" },
  ];

  return (
    <Group
      h="100%"
      justify="space-around"
      align="center"
      px="xs"
      wrap="nowrap"
      className={classes.navContainer}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <UnstyledButton
            key={item.path}
            component={Link}
            to={item.path}
            className={classes.navButton}
            data-active={isActive}
          >
            <Stack gap={5} align="center" c={isActive ? "primary.6" : "dark.1"}>
              <item.icon size={24} stroke={2} />
              {showLabels && (
                <Text size="xs" fw={500} c="inherit">
                  {item.label}
                </Text>
              )}
            </Stack>
          </UnstyledButton>
        );
      })}
    </Group>
  );
};

export default BottomNav;
