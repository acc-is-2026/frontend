import { tmdbService } from "@/services/tmdb.service";
import type { ContinueWatchingItem, TrackedItem } from "@/types/tracking.type";
import { formatRuntime } from "@/utils/format.utils";
import {
  countRemainingEpisodes,
  getNextEpisode,
} from "@/utils/nextEpisode.util";

const buildTvItem = async (
  item: TrackedItem,
): Promise<ContinueWatchingItem | null> => {
  const tv = await tmdbService.getTvDetails(item.tmdbId);

  const last =
    item.lastWatched?.season != null && item.lastWatched.episode != null
      ? { season: item.lastWatched.season, episode: item.lastWatched.episode }
      : null;

  const next = getNextEpisode(tv, last);
  if (!next) return null;

  const remainingEpisodes = countRemainingEpisodes(tv, next);
  if (remainingEpisodes === 0) return null;

  const episode = await tmdbService
    .getTvEpisode(item.tmdbId, next.season, next.episode)
    .catch(() => null);

  const minutes = episode?.runtime ?? tv.episode_run_time[0];

  return {
    id: item.id,
    tmdbId: item.tmdbId,
    mediaType: "TV",
    title: item.title ?? tv.name,
    posterPath: item.posterPath,
    backdropPath: tv.backdrop_path ?? episode?.still_path ?? null,
    stillPath: episode?.still_path ?? null,
    season: next.season,
    episode: next.episode,
    episodeTitle: episode?.name,
    runtime: minutes ? formatRuntime(minutes) : undefined,
    remainingEpisodes,
  };
};

const buildMovieItem = async (
  item: TrackedItem,
): Promise<ContinueWatchingItem> => {
  const movie = await tmdbService.getMovieDetails(item.tmdbId);

  return {
    id: item.id,
    tmdbId: item.tmdbId,
    mediaType: "MOVIE",
    title: item.title ?? "No title",
    posterPath: item.posterPath,
    backdropPath: movie.backdrop_path,
    runtime: movie.runtime ? formatRuntime(movie.runtime) : undefined,
  };
};

export const buildContinueWatchingItems = async (
  items: TrackedItem[],
): Promise<ContinueWatchingItem[]> => {
  const results = await Promise.allSettled(
    items.map((item) =>
      item.mediaType === "TV" ? buildTvItem(item) : buildMovieItem(item),
    ),
  );

  return results.flatMap((r) =>
    r.status === "fulfilled" && r.value ? [r.value] : [],
  );
};
