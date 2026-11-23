import { tmdbService } from "@/services/tmdb.service";
import { showTrackingService } from "@/services/showTracking.service";
import type { TrackedItem } from "@/types/tracking.type";
import {
  countRemainingEpisodes,
  getNextEpisode,
} from "@/utils/nextEpisode.util";

const hasNewEpisodes = async (item: TrackedItem) => {
  const { season, episode } = item.lastWatched ?? {};
  if (season == null || episode == null) return false;

  const tv = await tmdbService.getTvDetails(item.tmdbId);
  const next = getNextEpisode(tv, { season, episode });

  return !!next && countRemainingEpisodes(tv, next) > 0;
};

export const reactivateCompletedShows = async (
  items: TrackedItem[],
): Promise<TrackedItem[]> => {
  const candidates = items.filter(
    (item) => item.mediaType === "TV" && item.status === "COMPLETED",
  );

  const results = await Promise.allSettled(
    candidates.map(async (item) => {
      if (!(await hasNewEpisodes(item))) return null;
      await showTrackingService.updateStatus(item.tmdbId, "WATCHING");
      return item.id;
    }),
  );

  const reactivated = new Set(
    results.flatMap((r) =>
      r.status === "fulfilled" && r.value ? [r.value] : [],
    ),
  );

  return items.map((item) =>
    reactivated.has(item.id) ? { ...item, status: "WATCHING" } : item,
  );
};
