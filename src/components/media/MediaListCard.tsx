import { memo } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  UnstyledButton,
  Group,
  Badge,
} from "@mantine/core";
import {
  IconMovie,
  IconDeviceTv,
  IconClock,
  IconCertificate,
  IconBookmarkFilled,
  IconCircleCheckFilled,
  IconProgress,
  IconPlaylistX,
} from "@tabler/icons-react";
import classes from "./MediaListCard.module.css";
import { Link, useLocation } from "react-router-dom";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { useTrackingStore } from "@/store/useTrackingStore";
import RemoveButton from "../ui/RemoveButton";

export interface MediaListCardProps {
  id: number | string;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  year?: string;
  mediaType: "MOVIE" | "TV";
  showTypeIcon?: boolean;
  genres?: string[];
  runtime?: string;
  certification?: string;
  onRemove?: () => Promise<void>;
}

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/w780";

export const MediaListCard = memo(function MediaListCard({
  id,
  title,
  posterPath,
  backdropPath,
  year,
  mediaType,
  showTypeIcon,
  genres = [],
  runtime,
  certification,
  onRemove,
}: MediaListCardProps) {
  const posterUrl = posterPath
    ? `${TMDB_IMAGE_BASE_URL}${posterPath}`
    : "https://placehold.co/500x750/11141b/626d82?text=No+Poster";

  const backdropUrl = backdropPath
    ? `${TMDB_BACKDROP_URL}${backdropPath}`
    : null;

  const { pathname } = useLocation();

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
    <Box pos="relative">
      <UnstyledButton
        component={Link}
        to={`/${mediaType === "TV" ? "tv" : "movie"}/${id}`}
        className={classes.card}
        w="100%"
        h={160}
        display="flex"
      >
        <Box p={12} h="100%" className={classes.posterWrapper}>
          <Image
            src={posterUrl}
            alt={title}
            loading="lazy"
            h="100%"
            className={classes.posterImage}
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
            {inWatchlist && pathname !== "/watchlist" && (
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

        <Flex
          flex={1}
          pos="relative"
          direction="column"
          style={{ overflow: "hidden" }}
        >
          {backdropUrl && (
            <>
              <Box
                className={classes.backdropWrapper}
                style={{ backgroundImage: `url(${backdropUrl})` }}
              />
              <Box className={classes.backdropGradient} />
            </>
          )}

          <Flex
            className={classes.textContainer}
            pos="relative"
            flex={1}
            p="12px 16px 12px 4px"
            direction="column"
            justify="space-between"
          >
            <Box>
              <Text
                c="white"
                fw={700}
                size="md"
                lineClamp={1}
                pr={onRemove ? 28 : 0}
              >
                {title}
              </Text>

              <Group gap={6} mt={4}>
                {year && (
                  <Text size="xs" c="dimmed" fw={500}>
                    {year}
                  </Text>
                )}
                {genres.length > 0 && (
                  <>
                    <Text size="xs" c="dimmed" className={classes.metadataItem}>
                      •
                    </Text>
                    <Text
                      size="xs"
                      c="dimmed"
                      lineClamp={1}
                      style={{ flex: 1 }}
                      className={classes.metadataItem}
                    >
                      {genres.join(", ")}
                    </Text>
                  </>
                )}
              </Group>
            </Box>

            <Group gap={12} mt="auto">
              {showTypeIcon && (
                <Badge
                  size="sm"
                  variant="outline"
                  color="primary.6"
                  style={{ cursor: "inherit" }}
                  leftSection={
                    mediaType === "MOVIE" ? (
                      <IconMovie size={12} />
                    ) : (
                      <IconDeviceTv size={12} />
                    )
                  }
                >
                  {mediaType === "MOVIE" ? "Movie" : "TV"}
                </Badge>
              )}

              {runtime && (
                <Group gap={4} className={classes.metadataItem}>
                  <IconClock size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed" fw={600}>
                    {runtime}
                  </Text>
                </Group>
              )}

              {certification && (
                <Group gap={4} className={classes.metadataItem}>
                  <IconCertificate
                    size={14}
                    color="var(--mantine-color-dimmed)"
                  />
                  <Text size="xs" c="dimmed" fw={600}>
                    {certification}
                  </Text>
                </Group>
              )}
            </Group>
          </Flex>
        </Flex>
      </UnstyledButton>

      {onRemove && <RemoveButton onRemove={onRemove} />}
    </Box>
  );
});
