import type {
  TmdbCollection,
  TmdbEpisodeDetails,
  TmdbEpisodeFullDetails,
  TmdbMovieDetails,
  TmdbMovieFullDetails,
  TmdbResponse,
  TmdbSeasonDetails,
  TmdbTvDetails,
  TmdbTvFullDetails,
} from "@/types/tmdb.type";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const apiCache = new Map<string, unknown>();

const fetchTmdb = async <T>(
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<T> => {
  const queryParams = new URLSearchParams({
    language: "en-US",
    ...Object.entries(params).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: String(v) }),
      {},
    ),
  });

  const fullUrl = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;

  if (apiCache.has(fullUrl)) {
    return apiCache.get(fullUrl) as T;
  }

  const response = await fetch(fullUrl, {
    headers: {
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB error: ${response.statusText}`);
  }

  const data = (await response.json()) as T;
  apiCache.set(fullUrl, data);
  return data;
};

export const tmdbService = {
  getTrending: (
    mediaType: "all" | "movie" | "tv" = "all",
    timeWindow: "day" | "week" = "week",
    page = 1,
  ) =>
    fetchTmdb<TmdbResponse>(`/trending/${mediaType}/${timeWindow}`, { page }),

  getNowPlayingMovies: (page = 1) =>
    fetchTmdb<TmdbResponse>("/movie/now_playing", { page }),

  getMovieDetails: (id: number) =>
    fetchTmdb<TmdbMovieDetails>(`/movie/${id}`, {
      append_to_response: "release_dates",
    }),

  getMovieFullDetails: (id: number) =>
    fetchTmdb<TmdbMovieFullDetails>(`/movie/${id}`, {
      append_to_response: "credits,videos,recommendations,release_dates",
    }),

  getCollection: (id: number) => fetchTmdb<TmdbCollection>(`/collection/${id}`),

  getTvDetails: (id: number) =>
    fetchTmdb<TmdbTvDetails>(`/tv/${id}`, {
      append_to_response: "content_ratings",
    }),

  getTvFullDetails: (id: number) =>
    fetchTmdb<TmdbTvFullDetails>(`/tv/${id}`, {
      append_to_response:
        "aggregate_credits,videos,recommendations,similar,content_ratings,external_ids",
    }),

  getTvSeason: (tvId: number, season: number) =>
    fetchTmdb<TmdbSeasonDetails>(`/tv/${tvId}/season/${season}`),

  getTvEpisode: (tvId: number, season: number, episode: number) =>
    fetchTmdb<TmdbEpisodeDetails>(
      `/tv/${tvId}/season/${season}/episode/${episode}`,
    ),

  getTvEpisodeFullDetails: (tvId: number, season: number, episode: number) =>
    fetchTmdb<TmdbEpisodeFullDetails>(
      `/tv/${tvId}/season/${season}/episode/${episode}`,
      { append_to_response: "credits,external_ids" },
    ),

  search: async (
    query?: string,
    type: "multi" | "movie" | "tv" = "multi",
    page = 1,
  ) => {
    if (!query?.trim()) {
      const trendingType = type === "multi" ? "all" : type;
      const trendingData = await tmdbService.getTrending(
        trendingType,
        "week",
        page,
      );

      if (trendingType === "all") {
        trendingData.results = trendingData.results.filter(
          (item) => item.media_type !== "person",
        );
      }
      return trendingData;
    }

    const data = await fetchTmdb<TmdbResponse>(`/search/${type}`, {
      query,
      page,
      include_adult: 0,
    });

    let improvedResults = data.results;

    if (type === "multi") {
      improvedResults = improvedResults.filter(
        (item) => item.media_type !== "person",
      );
    }

    improvedResults = improvedResults.filter((item) => {
      const hasPoster = !!item.poster_path;
      const hasVotes = (item.vote_count || 0) > 2;

      return hasPoster || hasVotes;
    });

    improvedResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    data.results = improvedResults;

    return data;
  },
};
