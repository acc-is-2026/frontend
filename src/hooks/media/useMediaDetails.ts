import { useEffect, useState } from "react";
import { tmdbService } from "@/services/tmdb.service";
import { formatRuntime } from "@/utils/format.utils";
import { getUsCertification, getUsTvRating } from "@/utils/media.util";

export interface MediaDetails {
  backdropPath?: string | null;
  genres?: string[];
  year?: string;
  runtime?: string;
  certification?: string;
}

const loadDetails = async (
  id: number,
  mediaType: "MOVIE" | "TV",
): Promise<MediaDetails> => {
  if (mediaType === "TV") {
    const tv = await tmdbService.getTvDetails(id);
    const episodes = tv.number_of_episodes;

    return {
      backdropPath: tv.backdrop_path,
      genres: tv.genres.map((g) => g.name),
      year: tv.first_air_date?.slice(0, 4),
      runtime: episodes
        ? `${episodes} ${episodes === 1 ? "episode" : "episodes"}`
        : undefined,
      certification: getUsTvRating(tv.content_ratings),
    };
  }

  const movie = await tmdbService.getMovieDetails(id);

  return {
    backdropPath: movie.backdrop_path,
    genres: movie.genres.map((g) => g.name),
    year: movie.release_date?.slice(0, 4),
    runtime: movie.runtime ? formatRuntime(movie.runtime) : undefined,
    certification: getUsCertification(movie.release_dates),
  };
};

export function useMediaDetails(
  id: number | string,
  mediaType: "MOVIE" | "TV",
) {
  const [details, setDetails] = useState<MediaDetails>({});

  useEffect(() => {
    let cancelled = false;

    loadDetails(Number(id), mediaType)
      .then((result) => {
        if (!cancelled) setDetails(result);
      })
      .catch((error) => console.error("Details fetch error:", error));

    return () => {
      cancelled = true;
    };
  }, [id, mediaType]);

  return details;
}
