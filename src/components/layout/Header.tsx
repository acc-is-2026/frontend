import React from "react";
import { Box } from "@mantine/core";
import { useSmartHeader } from "@/hooks/useSmartHeader";

interface HeaderProps {
  children: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  const isVisible = useSmartHeader();

  return (
    <Box
      component="header"
      px={{ base: "md", sm: "xl", lg: "5%" }}
      py={{ base: "sm" }}
      bg="var(--app-background)"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: "1px solid var(--mantine-color-dark-8)",
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 260ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </Box>
  );
};
