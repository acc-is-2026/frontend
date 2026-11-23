export interface WatchlistItemDto {
  tmdbId: number;
  mediaType: "MOVIE" | "TV";
  title: string | null;
  posterPath: string | null;
}

export interface WatchlistResponse {
  items: WatchlistItemDto[];
  page: number;
  totalPages: number;
}
