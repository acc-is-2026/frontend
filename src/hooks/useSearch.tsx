import { tmdbService } from "@/services/tmdb.service";
import { type MediaTypeFilter } from "@/store/useFilterStore";
import type { TmdbMediaItem } from "@/types/tmdb.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useSearch = (mediaType: MediaTypeFilter) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<TmdbMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (newQuery: string) => {
    setSearchParams(
      (prev) => {
        if (newQuery) {
          prev.set("q", newQuery);
        } else {
          prev.delete("q");
        }
        return prev;
      },
      { replace: true },
    );
  };

  const fetchResults = async () => {
    setIsLoading(true);

    try {
      const tmdbSearchType =
        mediaType === "ALL"
          ? "multi"
          : (mediaType.toLowerCase() as "movie" | "tv");

      const response = await tmdbService.search(query, tmdbSearchType, 1);
      setResults(response.results);
    } catch (error) {
      console.error("Search error:", error);
      setError(getErrorMessage(error, "Something went wrong. Try again..."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [query, mediaType]);

  return {
    query,
    results,
    isLoading,
    error,
    handleSearch,
    refetch: fetchResults,
  };
};

export default useSearch;
