import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { watchlistService } from "@/services/watchlist.service";
import { useTrackingStore } from "@/store/useTrackingStore";
import { userActivityService } from "@/services/userActivity.service";
import { reactivateCompletedShows } from "@/utils/reactivateShows.util";

export const useAppSync = () => {
  const { isAuthenticated } = useAuthStore();
  const syncWatchlist = useWatchlistStore((state) => state.syncWithBackend);
  const syncTracking = useTrackingStore((state) => state.syncWithBackend);

  useEffect(() => {
    if (!isAuthenticated) return;

    const syncUserData = async () => {
      try {
        const [watchlistResponse, trackingResponse] = await Promise.all([
          watchlistService.getWatchlist("ALL"),
          userActivityService.getUserTrackingLibrary(),
        ]);

        syncWatchlist(watchlistResponse.items);
        syncTracking(await reactivateCompletedShows(trackingResponse.items));
      } catch (error) {
        console.error("Backend sync error:", error);
      }
    };

    syncUserData();
  }, [isAuthenticated, syncWatchlist, syncTracking]);
};
