import { historyService } from "@/services/history.service";
import type { MediaTypeFilter } from "@/store/useFilterStore";
import type { HistoryItem } from "@/types/tracking.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useCallback, useEffect, useRef, useState } from "react";

const useWatchHistory = (mediaType: MediaTypeFilter) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);

  const fetchHistory = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError("");

    try {
      const response = await historyService.getWatchHistory(mediaType, 1, 10);

      if (requestId !== requestIdRef.current) return;

      setItems(response.items);
    } catch (err) {
      console.error("Get watch history error:", err);
      setError(getErrorMessage(err, "Something went wrong. Try again..."));
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [mediaType]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchHistory,
  };
};

export default useWatchHistory;
