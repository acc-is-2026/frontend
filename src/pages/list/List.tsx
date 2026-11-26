import { Header } from "@/components/layout/Header";
import { MediaFilterTabs } from "@/components/layout/MediaFilterTabs";
import MediaListPage from "@/components/media/MediaListPage";
import DetailedMediaListCard from "@/components/media/DetailedMediaListCard";
import { ContinueWatchingListCard } from "@/components/media/ContinueWatchingListCard";
import { Box, Container, Group, Title } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import { tmdbService } from "@/services/tmdb.service";
import { userActivityService } from "@/services/userActivity.service";
import { getEpisodeHref, normalizeTmdbItem } from "@/utils/media.util";
import { useFilterStore } from "@/store/useFilterStore";
import BackButton from "@/components/ui/BackButton";
import { historyService } from "@/services/history.service";
import { useTrackingStore } from "@/store/useTrackingStore";
import type { HistoryItem } from "@/types/tracking.type";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage.util";

const PAGE_SIZE = 20;

const List = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source");
  const { mediaType } = useFilterStore();
  const showTypeIcon = mediaType === "ALL";

  const removeTrackedItem = useTrackingStore((s) => s.removeTrackedItem);

  const handleRemoveHistory = async (item: HistoryItem, remove: () => void) => {
    try {
      const { trackedMediaDeleted } = await historyService.removeItem(item.id);
      if (trackedMediaDeleted) removeTrackedItem(item.tmdbId, item.mediaType);
      remove();
    } catch (err) {
      notifications.show({
        color: "red",
        message: getErrorMessage(err, "Couldn't remove history entry."),
      });
    }
  };

  const fetchTrending = useCallback(
    async (page: number) => {
      const target =
        mediaType === "MOVIE" ? "movie" : mediaType === "TV" ? "tv" : "all";
      const data = await tmdbService.getTrending(target, "week", page);

      return {
        items: data.results.map((item) =>
          normalizeTmdbItem(item, mediaType === "TV" ? "TV" : "MOVIE"),
        ),
        hasMore: data.page < data.total_pages,
      };
    },
    [mediaType],
  );

  const fetchContinueWatching = useCallback(
    (page: number) =>
      userActivityService.getContinueWatching(mediaType, page, PAGE_SIZE),
    [mediaType],
  );

  const fetchHistory = useCallback(
    (page: number) =>
      historyService.getWatchHistory(mediaType, page, PAGE_SIZE),
    [mediaType],
  );

  let pageTitle;
  switch (source) {
    case "trending":
      pageTitle = "Trending";
      break;

    case "continueWatching":
      pageTitle = "Continue watching";
      break;

    case "history":
      pageTitle = "History";
      break;

    default:
      break;
  }

  return (
    <Container size="xl" px={0} pt={85} pb={40}>
      <Header>
        <Group gap="xs" mb="sm">
          <BackButton />
          <Title size="xl">{pageTitle}</Title>
        </Group>

        <MediaFilterTabs />
      </Header>

      <Box mt={{ base: "xl", sm: "lg" }}>
        {source === "continueWatching" ? (
          <MediaListPage
            fetchPage={fetchContinueWatching}
            renderItem={(item) => (
              <ContinueWatchingListCard
                item={item}
                showTypeIcon={showTypeIcon}
              />
            )}
          />
        ) : source === "history" ? (
          <MediaListPage
            fetchPage={fetchHistory}
            renderItem={(item, remove) => (
              <ContinueWatchingListCard
                item={item}
                showTypeIcon={showTypeIcon}
                watchedAt={item.watchedAt}
                to={getEpisodeHref(item)}
                onRemove={() => handleRemoveHistory(item, remove)}
              />
            )}
          />
        ) : source === "trending" ? (
          <MediaListPage
            fetchPage={fetchTrending}
            renderItem={(media) => (
              <DetailedMediaListCard
                media={media}
                showTypeIcon={showTypeIcon}
              />
            )}
          />
        ) : null}
      </Box>
    </Container>
  );
};

export default List;
