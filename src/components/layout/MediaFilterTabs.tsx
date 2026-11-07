import React from "react";
import { Group, UnstyledButton, Text, Box } from "@mantine/core";
import { IconMovie, IconDeviceTv, IconVideo } from "@tabler/icons-react";
import { useFilterStore, type MediaTypeFilter } from "@/store/useFilterStore";
import classes from "./MediaFilterTabs.module.css";

interface FilterOption {
  value: MediaTypeFilter;
  label: string;
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: "ALL", label: "Media", icon: IconVideo },
  { value: "MOVIE", label: "Movies", icon: IconMovie },
  { value: "TV", label: "Shows", icon: IconDeviceTv },
];

export const MediaFilterTabs: React.FC = () => {
  const { mediaType, setMediaType } = useFilterStore();

  return (
    <Group gap={8} p={4} className={classes.tabs}>
      {FILTER_OPTIONS.map((option) => {
        const isActive = mediaType === option.value;
        const IconComponent = option.icon;

        return (
          <UnstyledButton
            key={option.value}
            onClick={() => setMediaType(option.value)}
            className={`${classes.button} ${isActive ? classes.active : ""}`}
            aria-pressed={isActive}
          >
            <Box className={classes.icon}>
              <IconComponent size={16} />
            </Box>

            <Text size="xs" inherit className={classes.label}>
              {option.label}
            </Text>
          </UnstyledButton>
        );
      })}
    </Group>
  );
};
