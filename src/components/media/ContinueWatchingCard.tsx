import { memo } from "react";
import { Box, Image, Text, UnstyledButton } from "@mantine/core";
import { Link } from "react-router-dom";
import type { ContinueWatchingItem } from "@/types/tracking.type";
import classes from "./ContinueWatchingCard.module.css";
import { IconCircleCheckFilled, IconHistory } from "@tabler/icons-react";
import { formatWatchedDate } from "@/utils/format.utils";
import { getMediaHref } from "@/utils/media.util";
import badgeClasses from "./MediaCard.module.css";

const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
  watchedAt?: string;
  to?: string;
  watched?: boolean;
}

export const ContinueWatchingCard = memo(function ContinueWatchingCard({
  item,
  watchedAt,
  to,
  watched = false,
}: ContinueWatchingCardProps) {
  const imageUrl = item.backdropPath
    ? `${TMDB_BACKDROP_BASE_URL}${item.backdropPath}`
    : "https://placehold.co/780x439/11141b/626d82?text=No+Image";

  const episodeLabel =
    item.season != null && item.episode != null
      ? `S${item.season}E${item.episode}`
      : undefined;

  const metadata = [
    item.runtime,
    item.remainingEpisodes != null &&
      `${item.remainingEpisodes} ${item.remainingEpisodes === 1 ? "episode" : "episodes"} left`,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <UnstyledButton
      component={Link}
      to={to ?? getMediaHref(item)}
      className={classes.card}
    >
      <Box className={classes.thumbnail}>
        <Image
          src={imageUrl}
          alt={item.title}
          fit="cover"
          w="100%"
          h="100%"
          loading="lazy"
        />
        {watchedAt && (
          <Box className={classes.dateBadge}>
            <IconHistory size={12} />
            {formatWatchedDate(watchedAt)}
          </Box>
        )}

        {watched && (
          <Box className={badgeClasses.badgesContainer}>
            <Box className={badgeClasses.iconBadge}>
              <IconCircleCheckFilled
                size={14}
                color="var(--mantine-color-green-5)"
              />
            </Box>
          </Box>
        )}
      </Box>

      <Box style={{ width: "100%" }}>
        <Text size="sm" fw={600} c="white" lineClamp={1} title={item.title}>
          {item.title}
        </Text>

        {item.episodeTitle && (
          <Text size="xs" c="dimmed" lineClamp={1} mt={2}>
            {episodeLabel} · {item.episodeTitle}
          </Text>
        )}

        {metadata && (
          <Text size="xs" c="dimmed" lineClamp={1} mt={2}>
            {metadata}
          </Text>
        )}
      </Box>
    </UnstyledButton>
  );
});
