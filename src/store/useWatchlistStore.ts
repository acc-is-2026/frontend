import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WatchlistMedia {
  id: number | string;
  mediaType: "MOVIE" | "TV";
}

interface WatchlistState {
  watchlistItems: Record<string, boolean>;

  syncWithBackend: (items: WatchlistMedia[]) => void;

  setWatchlistStatus: (
    id: number | string,
    mediaType: "MOVIE" | "TV",
    isAdded: boolean,
  ) => void;

  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      watchlistItems: {},

      syncWithBackend: (items) => {
        const newWatchlist: Record<string, boolean> = {};
        items.forEach((item) => {
          newWatchlist[`${item.mediaType}-${item.id}`] = true;
        });
        set({ watchlistItems: newWatchlist });
      },

      setWatchlistStatus: (id, mediaType, isAdded) =>
        set((state) => {
          const key = `${mediaType}-${id}`;
          const updated = { ...state.watchlistItems };

          if (isAdded) {
            updated[key] = true;
          } else {
            delete updated[key];
          }

          return { watchlistItems: updated };
        }),

      clearWatchlist: () => set({ watchlistItems: {} }),
    }),
    {
      name: "watchlist-storage",
    },
  ),
);
