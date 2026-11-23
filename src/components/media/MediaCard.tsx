import { memo } from "react";
import { Box, Text, Image, UnstyledButton, Group } from "@mantine/core";
import classes from "./MediaCard.module.css";
import {
  IconBookmarkFilled,
  IconCircleCheckFilled,
  IconDeviceTv,
  IconMovie,
  IconPlaylistX,
  IconProgress,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import listClasses from "./MediaListCard.module.css";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { useTrackingStore } from "@/store/useTrackingStore";

export interface MediaCardProps {
  id: number | string;
  title: string;
  posterPath: string | null;
  year?: string | number;
  runtime?: string;
  mediaType: "MOVIE" | "TV";
  showTypeIcon?: boolean;
}

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const MediaCard = memo(function MediaCard({
  id,
  title,
  posterPath,
  year,
  runtime,
  mediaType,
  showTypeIcon = false,
}: MediaCardProps) {
  const imageUrl = posterPath
    ? `${TMDB_IMAGE_BASE_URL}${posterPath}`
    : "https://placehold.co/500x750/11141b/626d82?text=No+Poster";

  const TypeIcon = mediaType === "TV" ? IconDeviceTv : IconMovie;

  const trackedItem = useTrackingStore(
    (state) => state.trackedItems[`${mediaType}-${id}`],
  );
  const isCompleted = trackedItem?.status === "COMPLETED";
  const isWatching = trackedItem?.status === "WATCHING";
  const isDropped = trackedItem?.status === "DROPPED";

  const inWatchlist = useWatchlistStore(
    (state) => !!state.watchlistItems[`${mediaType}-${id}`],
  );

  return (
    <UnstyledButton
      component={Link}
      to={`/${mediaType === "TV" ? "tv" : "movie"}/${id}`}
      className={classes.card}
    >
      <Box className={classes.poster}>
        <Image
          src={imageUrl}
          alt={title}
          fit="cover"
          w="100%"
          h="100%"
          loading="lazy"
        />

        <Box className={classes.badgesContainer}>
          {isCompleted && (
            <Box className={classes.iconBadge}>
              <IconCircleCheckFilled
                size={14}
                color="var(--mantine-color-green-5)"
              />
            </Box>
          )}
          {isWatching && (
            <Box className={classes.iconBadge}>
              <IconProgress size={14} color="var(--mantine-color-yellow-5)" />
            </Box>
          )}
          {inWatchlist && (
            <Box className={classes.iconBadge}>
              <IconBookmarkFilled
                size={14}
                color="var(--mantine-color-yellow-5)"
              />
            </Box>
          )}
          {isDropped && (
            <Box className={classes.iconBadge}>
              <IconPlaylistX size={14} color="var(--mantine-color-red-5)" />
            </Box>
          )}
        </Box>
      </Box>

      <Box style={{ width: "100%" }}>
        <Group gap={6} wrap="nowrap">
          {showTypeIcon && mediaType && (
            <TypeIcon
              size={14}
              stroke={2}
              style={{ flexShrink: 0, color: "var(--mantine-color-dimmed)" }}
              aria-label={mediaType === "TV" ? "Show" : "Movie"}
            />
          )}
          <Text
            size="sm"
            fw={600}
            c="white"
            lineClamp={1}
            title={title}
            style={{ minWidth: 0 }}
          >
            {title}
          </Text>
        </Group>

        <Group gap={4} mt={2} wrap="nowrap">
          {year && (
            <Text size="xs" c="dimmed">
              {year}
            </Text>
          )}

          {year && runtime && (
            <Text size="xs" c="dimmed" className={listClasses.metadataItem}>
              •
            </Text>
          )}

          {runtime && (
            <Text
              size="xs"
              c="dimmed"
              lineClamp={1}
              style={{ flex: 1 }}
              className={listClasses.metadataItem}
            >
              {runtime}
            </Text>
          )}
        </Group>
      </Box>
    </UnstyledButton>
  );
});
