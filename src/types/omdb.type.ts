export interface OmdbRating {
  Source: string;
  Value: string;
}

export interface OmdbResponse {
  Response: "True" | "False";
  imdbRating?: string;
  imdbVotes?: string;
  Metascore?: string;
  Ratings?: OmdbRating[];
  Error?: string;
}
