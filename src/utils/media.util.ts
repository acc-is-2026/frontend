import type {
  TmdbMediaItem,
  TmdbMovieDetails,
  TmdbTvDetails,
} from "@/types/tmdb.type";
import type { ContinueWatchingItem } from "@/types/tracking.type";

export interface NormalizedMedia {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  year?: string;
  mediaType: "MOVIE" | "TV";
}

export const normalizeTmdbItem = (
  item: TmdbMediaItem,
  defaultMediaType: "MOVIE" | "TV" = "MOVIE",
): NormalizedMedia => ({
  id: item.id,
  title: item.title || item.name || "No title",
  posterPath: item.poster_path,
  backdropPath: item.backdrop_path,
  year: (item.release_date || item.first_air_date)?.slice(0, 4),
  mediaType: item.media_type
    ? item.media_type === "tv"
      ? "TV"
      : "MOVIE"
    : defaultMediaType,
});

export const getMediaHref = (item: ContinueWatchingItem) => {
  if (item.mediaType === "MOVIE") return `/movie/${item.tmdbId}`;
  return `/tv/${item.tmdbId}`;
};

export const getEpisodeHref = (item: ContinueWatchingItem) => {
  if (item.mediaType === "TV" && item.season != null && item.episode != null) {
    return `/tv/${item.tmdbId}/season/${item.season}/episode/${item.episode}`;
  }
  return getMediaHref(item);
};

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const POSTER_PLACEHOLDER =
  "https://placehold.co/500x750/11141b/626d82?text=No+Poster";
export const STILL_PLACEHOLDER =
  "https://placehold.co/780x439/11141b/626d82?text=No+Image";

export const getTmdbImageUrl = (
  path: string | null | undefined,
  size: "w185" | "w342" | "w500" | "w780" | "w1280" | "original" = "w500",
) => (path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null);

export const getUsCertification = (
  releaseDates: TmdbMovieDetails["release_dates"],
) =>
  releaseDates.results
    .find((r) => r.iso_3166_1 === "US")
    ?.release_dates.find((d) => d.certification.trim() !== "")?.certification;

export const getUsTvRating = (
  contentRatings: TmdbTvDetails["content_ratings"],
) =>
  contentRatings.results.find((r) => r.iso_3166_1 === "US")?.rating ||
  undefined;
