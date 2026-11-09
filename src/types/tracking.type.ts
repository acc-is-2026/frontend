export interface TrackedItem {
  id: string;
  tmdbId: number;
  mediaType: "MOVIE" | "TV";
  title: string | null;
  posterPath: string | null;
  status: "WATCHING" | "COMPLETED" | "DROPPED";
  lastWatched: {
    season: number | null;
    episode: number | null;
    date: Date | string;
  } | null;
}

export interface ContinueWatchingItem {
  id: string;
  tmdbId: number;
  mediaType: "MOVIE" | "TV";
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  stillPath?: string | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  runtime?: string;
  remainingEpisodes?: number;
}

export interface ContinueWatchingResponse {
  items: TrackedItem[];
  page: number;
  totalPages: number;
  total: number;
}

export interface StatusCounts {
  total: number;
  watching: number;
  completed: number;
  dropped: number;
}

export interface UserStats {
  episodesWatched: number;
  shows: StatusCounts;
  movies: StatusCounts;
}

export interface WatchHistoryEntry {
  id: string;
  trackedMediaId: string;
  tmdbId: number;
  mediaType: "MOVIE" | "TV";
  title: string | null;
  posterPath: string | null;
  status: "WATCHING" | "COMPLETED" | "DROPPED";
  season: number | null;
  episode: number | null;
  watchedAt: string;
}
export interface WatchHistoryResponse {
  items: WatchHistoryEntry[];
  page: number;
  totalPages: number;
  total: number;
}
export type HistoryItem = ContinueWatchingItem & { watchedAt: string };

export interface TrackedMediaDetails {
  id: string;
  tmdbId: number;
  mediaType: "MOVIE" | "TV";
  status: "WATCHING" | "COMPLETED" | "DROPPED";
  title: string | null;
  posterPath: string | null;
  watchHistory: {
    id: string;
    seasonNumber: number | null;
    episodeNumber: number | null;
    watchedAt: string;
  }[];
}

export type TrackedMediaSummary = Omit<TrackedMediaDetails, "watchHistory">;
