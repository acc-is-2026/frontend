import { memo } from "react";
import {
  Badge,
  Box,
  Flex,
  Group,
  Image,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconClock,
  IconDeviceTv,
  IconHistory,
  IconMovie,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import type { ContinueWatchingItem } from "@/types/tracking.type";
import { formatWatchedDate } from "@/utils/format.utils";
import { getMediaHref } from "@/utils/media.util";
import classes from "./MediaListCard.module.css";
import RemoveButton from "../ui/RemoveButton";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/original";

interface ContinueWatchingListCardProps {
  item: ContinueWatchingItem;
  showTypeIcon?: boolean;
  watchedAt?: string;
  to?: string;
  onRemove?: () => Promise<void>;
}

export const ContinueWatchingListCard = memo(function ContinueWatchingListCard({
  item,
  showTypeIcon,
  watchedAt,
  to,
  onRemove,
}: ContinueWatchingListCardProps) {
  const posterUrl = item.posterPath
    ? `${TMDB_IMAGE_BASE_URL}${item.posterPath}`
    : "https://placehold.co/500x750/11141b/626d82?text=No+Poster";

  const backdropPath = item.stillPath ?? item.backdropPath;
  const backdropUrl = backdropPath
    ? `${TMDB_BACKDROP_URL}${backdropPath}`
    : null;

  const episodeLabel =
    item.season != null && item.episode != null
      ? `S${item.season}E${item.episode}`
      : undefined;

  const remaining =
    item.remainingEpisodes != null &&
    `${item.remainingEpisodes} ${item.remainingEpisodes === 1 ? "episode" : "episodes"} left`;

  const mediaHref = getMediaHref(item);

  return (
    <Flex className={classes.card} w="100%" h={160} pos="relative">
      <UnstyledButton
        component={Link}
        to={mediaHref}
        p={12}
        h="100%"
        className={classes.posterWrapper}
      >
        <Image
          src={posterUrl}
          alt={item.title}
          loading="lazy"
          h="100%"
          className={classes.posterImage}
        />
      </UnstyledButton>

      <UnstyledButton
        component={Link}
        to={to ?? mediaHref}
        flex={1}
        pos="relative"
        display="flex"
        style={{ flexDirection: "column", overflow: "hidden" }}
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
              {item.title}
            </Text>

            {episodeLabel && (
              <Text size="xs" c="dimmed" fw={500} lineClamp={1} mt={4}>
                {episodeLabel}
                {item.episodeTitle && ` · ${item.episodeTitle}`}
              </Text>
            )}

            {remaining && (
              <Text size="xs" c="dimmed" lineClamp={1} mt={2}>
                {remaining}
              </Text>
            )}
          </Box>

          <Group gap={12} mt="auto">
            {showTypeIcon && (
              <Badge
                size="sm"
                variant="outline"
                color="primary.6"
                style={{ cursor: "inherit" }}
                leftSection={
                  item.mediaType === "MOVIE" ? (
                    <IconMovie size={12} />
                  ) : (
                    <IconDeviceTv size={12} />
                  )
                }
              >
                {item.mediaType === "MOVIE" ? "Movie" : "TV"}
              </Badge>
            )}

            {item.runtime && (
              <Group gap={4}>
                <IconClock size={14} color="var(--mantine-color-dimmed)" />
                <Text size="xs" c="dimmed" fw={600}>
                  {item.runtime}
                </Text>
              </Group>
            )}

            {watchedAt && (
              <Badge
                size="sm"
                variant="light"
                color="gray"
                style={{ cursor: "inherit" }}
                leftSection={<IconHistory size={12} />}
              >
                {formatWatchedDate(watchedAt, "long")}
              </Badge>
            )}
          </Group>
        </Flex>
      </UnstyledButton>

      {onRemove && <RemoveButton onRemove={onRemove} />}
    </Flex>
  );
});
