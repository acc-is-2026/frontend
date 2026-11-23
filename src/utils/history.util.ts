import { tmdbService } from "@/services/tmdb.service";
import type { HistoryItem, WatchHistoryEntry } from "@/types/tracking.type";
import { formatRuntime } from "@/utils/format.utils";

const memoizeById = <T>(fetcher: (id: number) => Promise<T>) => {
  const cache = new Map<number, Promise<T>>();
  return (id: number) => {
    let promise = cache.get(id);
    if (!promise) {
      promise = fetcher(id);
      cache.set(id, promise);
    }
    return promise;
  };
};

type TvFetcher = (id: number) => ReturnType<typeof tmdbService.getTvDetails>;
type MovieFetcher = (
  id: number,
) => ReturnType<typeof tmdbService.getMovieDetails>;

const buildTvItem = async (
  entry: WatchHistoryEntry,
  getTv: TvFetcher,
): Promise<HistoryItem> => {
  const tv = await getTv(entry.tmdbId);
  const { season, episode: episodeNumber } = entry;

  const episode =
    season != null && episodeNumber != null
      ? await tmdbService
          .getTvEpisode(entry.tmdbId, season, episodeNumber)
          .catch(() => null)
      : null;

  const minutes = episode?.runtime ?? tv.episode_run_time[0];

  return {
    id: entry.id,
    tmdbId: entry.tmdbId,
    mediaType: "TV",
    title: entry.title ?? tv.name,
    posterPath: entry.posterPath,
    backdropPath: tv.backdrop_path ?? episode?.still_path ?? null,
    stillPath: episode?.still_path ?? null,
    season: season ?? undefined,
    episode: episodeNumber ?? undefined,
    episodeTitle: episode?.name,
    runtime: minutes ? formatRuntime(minutes) : undefined,
    watchedAt: entry.watchedAt,
  };
};

const buildMovieItem = async (
  entry: WatchHistoryEntry,
  getMovie: MovieFetcher,
): Promise<HistoryItem> => {
  const movie = await getMovie(entry.tmdbId);

  return {
    id: entry.id,
    tmdbId: entry.tmdbId,
    mediaType: "MOVIE",
    title: entry.title ?? "No title",
    posterPath: entry.posterPath,
    backdropPath: movie.backdrop_path,
    runtime: movie.runtime ? formatRuntime(movie.runtime) : undefined,
    watchedAt: entry.watchedAt,
  };
};

export const buildHistoryItems = async (
  entries: WatchHistoryEntry[],
): Promise<HistoryItem[]> => {
  const getTv = memoizeById(tmdbService.getTvDetails);
  const getMovie = memoizeById(tmdbService.getMovieDetails);

  const results = await Promise.allSettled(
    entries.map((entry) =>
      entry.mediaType === "TV"
        ? buildTvItem(entry, getTv)
        : buildMovieItem(entry, getMovie),
    ),
  );

  return results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
};
