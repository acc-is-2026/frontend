import type { TmdbTvDetails } from "@/types/tmdb.type";

export interface EpisodeRef {
  season: number;
  episode: number;
}

export const getAiredEpisodes = (tv: TmdbTvDetails): EpisodeRef[] => {
  const lastAired = tv.last_episode_to_air?.season_number
    ? tv.last_episode_to_air
    : null;

  return getRegularSeasons(tv)
    .filter((s) => !lastAired || s.season_number <= lastAired.season_number)
    .flatMap((s) => {
      const count =
        lastAired && s.season_number === lastAired.season_number
          ? lastAired.episode_number
          : s.episode_count;

      return Array.from({ length: count }, (_, i) => ({
        season: s.season_number,
        episode: i + 1,
      }));
    });
};

const getRegularSeasons = (tv: TmdbTvDetails) =>
  tv.seasons
    .filter((s) => s.season_number > 0 && s.episode_count > 0)
    .sort((a, b) => a.season_number - b.season_number);

const toAbsoluteIndex = (tv: TmdbTvDetails, { season, episode }: EpisodeRef) =>
  getRegularSeasons(tv)
    .filter((s) => s.season_number < season)
    .reduce((sum, s) => sum + s.episode_count, 0) + episode;

export const getNextEpisode = (
  tv: TmdbTvDetails,
  last: EpisodeRef | null,
): EpisodeRef | null => {
  const seasons = getRegularSeasons(tv);
  if (seasons.length === 0) return null;

  if (!last) return { season: seasons[0].season_number, episode: 1 };

  const current = seasons.find((s) => s.season_number === last.season);
  if (current && last.episode < current.episode_count) {
    return { season: last.season, episode: last.episode + 1 };
  }

  const nextSeason = seasons.find((s) => s.season_number > last.season);
  return nextSeason ? { season: nextSeason.season_number, episode: 1 } : null;
};

export const countRemainingEpisodes = (
  tv: TmdbTvDetails,
  next: EpisodeRef,
): number => {
  const lastAired = tv.last_episode_to_air;
  const endIndex =
    lastAired && lastAired.season_number > 0
      ? toAbsoluteIndex(tv, {
          season: lastAired.season_number,
          episode: lastAired.episode_number,
        })
      : getRegularSeasons(tv).reduce((sum, s) => sum + s.episode_count, 0);

  return Math.max(0, endIndex - toAbsoluteIndex(tv, next) + 1);
};
