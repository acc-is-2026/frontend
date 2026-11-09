export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbMovieDetails {
  backdrop_path: string | null;
  genres: TmdbGenre[];
  release_date?: string;
  runtime: number | null;
  release_dates: {
    results: {
      iso_3166_1: string;
      release_dates: { certification: string }[];
    }[];
  };
}

export interface TmdbSeasonSummary {
  season_number: number;
  episode_count: number;
  air_date: string | null;
}

export interface TmdbEpisodeSummary {
  season_number: number;
  episode_number: number;
  air_date: string | null;
}

export interface TmdbEpisodeDetails {
  name: string;
  season_number: number;
  episode_number: number;
  runtime: number | null;
  still_path: string | null;
  air_date: string | null;
}

export interface TmdbSeasonEpisode extends TmdbEpisodeDetails {
  id: number;
  overview: string;
}

export interface TmdbSeasonDetails {
  id: number;
  name: string;
  season_number: number;
  episodes: TmdbSeasonEpisode[];
}

export interface TmdbEpisodeCrewMember {
  id: number;
  credit_id: string;
  name: string;
  job: string;
}

export interface TmdbEpisodeFullDetails extends TmdbSeasonEpisode {
  vote_average: number;
  credits: {
    cast: TmdbCastMember[];
    guest_stars: TmdbCastMember[];
    crew: TmdbEpisodeCrewMember[];
  };
  external_ids: { imdb_id: string | null };
}

export interface TmdbTvDetails {
  name: string;
  backdrop_path: string | null;
  genres: TmdbGenre[];
  first_air_date?: string;
  number_of_episodes: number;
  episode_run_time: number[];
  seasons: TmdbSeasonSummary[];
  last_episode_to_air: TmdbEpisodeSummary | null;
  content_ratings: {
    results: { iso_3166_1: string; rating: string }[];
  };
}

export interface TmdbMediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
  original_language?: string;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv" | "person";
  vote_count?: number;
  vote_average: number;
  popularity?: number;
}

export interface TmdbResponse {
  page: number;
  results: TmdbMediaItem[];
  total_pages: number;
  total_results: number;
}

export interface TmdbCastMember {
  id: number;
  credit_id: string;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbCrewMember {
  id: number;
  credit_id: string;
  name: string;
  job: string;
  department: string;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TmdbCollectionSummary {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface TmdbMovieFullDetails extends TmdbMovieDetails {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  status: string;
  imdb_id: string | null;
  vote_average: number;
  vote_count: number;
  belongs_to_collection: TmdbCollectionSummary | null;
  credits: {
    cast: TmdbCastMember[];
    crew: TmdbCrewMember[];
  };
  videos: { results: TmdbVideo[] };
  recommendations: TmdbResponse;
}

export interface TmdbCollection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: TmdbMediaItem[];
}

export interface TmdbAggregateCastMember {
  id: number;
  name: string;
  profile_path: string | null;
  order: number;
  total_episode_count: number;
  roles: { credit_id: string; character: string; episode_count: number }[];
}

export interface TmdbTvCreator {
  id: number;
  name: string;
}

export interface TmdbTvFullDetails extends TmdbTvDetails {
  id: number;
  overview: string;
  poster_path: string | null;
  status: string;
  last_air_date: string | null;
  in_production: boolean;
  number_of_seasons: number;
  vote_average: number;
  vote_count: number;
  created_by: TmdbTvCreator[];
  original_language: string;
  aggregate_credits: { cast: TmdbAggregateCastMember[] };
  videos: { results: TmdbVideo[] };
  recommendations: TmdbResponse;
  similar: TmdbResponse;
  external_ids: { imdb_id: string | null };
}
