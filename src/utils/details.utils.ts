import type {
  TmdbAggregateCastMember,
  TmdbCastMember,
  TmdbMediaItem,
  TmdbVideo,
} from "@/types/tmdb.type";
import type { DetailsCastMember, DetailsVideo } from "@/types/details.type";

const VIDEO_TYPES = ["Trailer", "Teaser", "Clip", "Featurette"];
const MAX_CAST = 20;
const MAX_RELATED = 20;
const MIN_RELATED_VOTES = 50;
const ANIMATION_GENRE_ID = 16;

const toVideo = (video: TmdbVideo): DetailsVideo => ({
  key: video.key,
  name: video.name,
  type: video.type,
});

export const pickVideos = (videos: TmdbVideo[]) => {
  const youtube = videos
    .filter((v) => v.site === "YouTube" && VIDEO_TYPES.includes(v.type))
    .sort(
      (a, b) =>
        VIDEO_TYPES.indexOf(a.type) - VIDEO_TYPES.indexOf(b.type) ||
        Number(b.official) - Number(a.official),
    );

  const trailer =
    youtube.find((v) => v.type === "Trailer" && v.official) ??
    youtube.find((v) => v.type === "Trailer" || v.type === "Teaser") ??
    null;

  return {
    trailer: trailer ? toVideo(trailer) : null,
    extras: youtube.map(toVideo),
  };
};

export const mapMovieCast = (cast: TmdbCastMember[]): DetailsCastMember[] =>
  [...cast]
    .sort((a, b) => a.order - b.order)
    .slice(0, MAX_CAST)
    .map((c) => ({
      id: c.credit_id,
      name: c.name,
      character: c.character,
      profilePath: c.profile_path,
    }));

interface RelatedSource {
  id: number;
  genreIds: number[];
  originalLanguage?: string;
}

export const pickRelated = (
  source: RelatedSource,
  recommendations: TmdbMediaItem[],
  similar: TmdbMediaItem[] = [],
): TmdbMediaItem[] => {
  const sourceGenres = new Set(source.genreIds);
  const sourceIsAnimated = sourceGenres.has(ANIMATION_GENRE_ID);
  const recommendedIds = new Set(recommendations.map((item) => item.id));

  const seen = new Set<number>([source.id]);
  const candidates = [...recommendations, ...similar].filter((item) => {
    if (seen.has(item.id) || !item.poster_path) return false;
    seen.add(item.id);
    const isAnimated = !!item.genre_ids?.includes(ANIMATION_GENRE_ID);
    return isAnimated === sourceIsAnimated;
  });

  const score = (item: TmdbMediaItem) => {
    const sharedGenres =
      item.genre_ids?.filter((g) => sourceGenres.has(g)).length ?? 0;
    const sameLanguage =
      !source.originalLanguage ||
      item.original_language === source.originalLanguage;

    return (
      Math.log10((item.vote_count ?? 0) + 1) * 2 +
      sharedGenres * 1.5 +
      (sameLanguage ? 2 : 0) +
      (recommendedIds.has(item.id) ? 1 : 0)
    );
  };

  const byScore = (a: TmdbMediaItem, b: TmdbMediaItem) => score(b) - score(a);

  const relevant = candidates
    .filter(
      (item) =>
        (item.vote_count ?? 0) >= MIN_RELATED_VOTES &&
        (sourceGenres.size === 0 ||
          !!item.genre_ids?.some((g) => sourceGenres.has(g))),
    )
    .sort(byScore);

  if (relevant.length >= MAX_RELATED) return relevant.slice(0, MAX_RELATED);

  const relevantIds = new Set(relevant.map((item) => item.id));
  const rest = candidates
    .filter((item) => !relevantIds.has(item.id))
    .sort(byScore);

  return [...relevant, ...rest].slice(0, MAX_RELATED);
};

export const mapTvCast = (
  cast: TmdbAggregateCastMember[],
): DetailsCastMember[] =>
  [...cast]
    .sort((a, b) => a.order - b.order)
    .slice(0, MAX_CAST)
    .map((c) => ({
      id: String(c.id),
      name: c.name,
      character: c.roles
        .map((r) => r.character)
        .filter(Boolean)
        .join(" / "),
      profilePath: c.profile_path,
      episodeCount: c.total_episode_count,
    }));

export const mapEpisodeCast = (
  cast: TmdbCastMember[],
  guestStars: TmdbCastMember[],
): DetailsCastMember[] => {
  const byOrder = (a: TmdbCastMember, b: TmdbCastMember) => a.order - b.order;
  const seen = new Set<string>();

  return [...[...cast].sort(byOrder), ...[...guestStars].sort(byOrder)]
    .filter((c) => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    })
    .slice(0, MAX_CAST)
    .map((c) => ({
      id: c.credit_id,
      name: c.name,
      character: c.character,
      profilePath: c.profile_path,
    }));
};
