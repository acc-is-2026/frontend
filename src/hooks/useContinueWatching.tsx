import { userActivityService } from "@/services/userActivity.service";
import type { MediaTypeFilter } from "@/store/useFilterStore";
import { useTrackingStore } from "@/store/useTrackingStore";
import type { ContinueWatchingItem } from "@/types/tracking.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useCallback, useEffect, useRef, useState } from "react";

const useWatching = (mediaType: MediaTypeFilter) => {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);
  const loadedTypeRef = useRef<MediaTypeFilter | null>(null);

  const syncVersion = useTrackingStore((state) => state.syncVersion);

  const fetchWatching = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    if (loadedTypeRef.current !== mediaType) setIsLoading(true);
    setError("");

    try {
      const response = await userActivityService.getContinueWatching(
        mediaType,
        1,
        10,
      );

      if (requestId !== requestIdRef.current) return;

      setItems(response.items);
      loadedTypeRef.current = mediaType;
    } catch (err) {
      console.error("Get watching error:", err);
      setError(getErrorMessage(err, "Something went wrong. Try again..."));
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [mediaType, syncVersion]);

  useEffect(() => {
    fetchWatching();
  }, [fetchWatching]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchWatching,
  };
};

export default useWatching;
