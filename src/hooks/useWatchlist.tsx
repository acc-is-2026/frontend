import { watchlistService } from "@/services/watchlist.service";
import type { MediaTypeFilter } from "@/store/useFilterStore";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import type { NormalizedMedia } from "@/utils/media.util";
import { useCallback, useEffect, useState } from "react";

const useWatchlist = (mediaType: MediaTypeFilter) => {
  const [items, setItems] = useState<NormalizedMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWatchlist = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await watchlistService.getWatchlist(mediaType, 1, 10);
      setItems(response.items);
    } catch (err) {
      console.error("Get watchlist error:", err);
      setError(getErrorMessage(err, "Something went wrong. Try again..."));
    } finally {
      setIsLoading(false);
    }
  }, [mediaType]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchWatchlist,
  };
};

export default useWatchlist;
