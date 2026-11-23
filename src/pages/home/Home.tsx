import { Container } from "@mantine/core";
import { useFilterStore } from "@/store/useFilterStore";
import { tmdbService } from "@/services/tmdb.service";
import { useMediaShelf } from "@/hooks/media/useMediaShelf";
import { MediaShelf } from "@/components/media/MediaShelf";
import { Header } from "@/components/layout/Header";
import { MediaFilterTabs } from "@/components/layout/MediaFilterTabs";
import useWatchlist from "@/hooks/useWatchlist";
import useWatching from "@/hooks/useContinueWatching";
import type { ContinueWatchingItem, HistoryItem } from "@/types/tracking.type";
import { ContinueWatchingCard } from "@/components/media/ContinueWatchingCard";
import useWatchHistory from "@/hooks/useWatchHistory";
import { getEpisodeHref } from "@/utils/media.util";

export function Home() {
  const { mediaType } = useFilterStore();

  const trendingTarget =
    mediaType === "MOVIE" ? "movie" : mediaType === "TV" ? "tv" : "all";

  const { items: trendingItems, isLoading: loadingTrending } = useMediaShelf(
    () => tmdbService.getTrending(trendingTarget, "week"),
    mediaType === "TV" ? "TV" : "MOVIE",
    [mediaType],
  );

  const isTheaterVisible = mediaType !== "TV";
  const { items: theaterItems, isLoading: loadingTheater } = useMediaShelf(
    () => tmdbService.getNowPlayingMovies(),
    "MOVIE",
    [],
  );

  const { items: watchlistItems, isLoading: loadingWatchlist } =
    useWatchlist(mediaType);

  const { items: watchingItems, isLoading: loadingWatching } =
    useWatching(mediaType);

  const { items: historyItems, isLoading: loadingHistory } =
    useWatchHistory(mediaType);

  const showTypeIcon = mediaType === "ALL";

  const renderContinueWatching = (item: ContinueWatchingItem) => (
    <ContinueWatchingCard
      item={item}
      to={`/tv/${item.tmdbId}/season/${item.season}/episode/${item.episode}`}
    />
  );

  const renderHistory = (item: HistoryItem) => (
    <ContinueWatchingCard
      item={item}
      watchedAt={item.watchedAt}
      to={getEpisodeHref(item)}
    />
  );

  return (
    <Container size="xl" px={0} pt={75} pb={40}>
      <Header>
        <MediaFilterTabs />
      </Header>

      <MediaShelf
        title="Continue Watching"
        subtitle="Continue where you left off"
        href={`/list?source=continueWatching&mediaType=${mediaType}`}
        items={watchingItems}
        isLoading={loadingWatching}
        variant="landscape"
        renderItem={renderContinueWatching}
        showTypeIcon={showTypeIcon}
      />

      <MediaShelf
        title="Start Watching"
        subtitle="Pick something new from your watchlist"
        href={`/watchlist`}
        items={watchlistItems}
        isLoading={loadingWatchlist}
        showTypeIcon={showTypeIcon}
      />

      <MediaShelf
        title="Trending"
        subtitle="Popular searches this week"
        href={`/list?source=trending&mediaType=${mediaType}`}
        items={trendingItems}
        isLoading={loadingTrending}
        showTypeIcon={showTypeIcon}
      />

      {isTheaterVisible && (
        <MediaShelf
          title="Now in theaters"
          subtitle="Recently released on the big screens"
          items={theaterItems}
          isLoading={loadingTheater}
          showTypeIcon={showTypeIcon}
        />
      )}

      <MediaShelf
        title="History"
        subtitle="Your watch history"
        href={`/list?source=history&mediaType=${mediaType}`}
        items={historyItems}
        isLoading={loadingHistory}
        variant="landscape"
        renderItem={renderHistory}
        showTypeIcon={showTypeIcon}
      />
    </Container>
  );
}
