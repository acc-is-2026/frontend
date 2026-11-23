import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TrackedItem } from "@/types/tracking.type";

interface TrackingState {
  trackedItems: Record<string, TrackedItem>;
  syncWithBackend: (items: TrackedItem[]) => void;
  setTrackedItem: (item: TrackedItem) => void;
  removeTrackedItem: (tmdbId: number, mediaType: "MOVIE" | "TV") => void;
  clearTracking: () => void;
  syncVersion: number;
}

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set) => ({
      trackedItems: {},
      syncVersion: 0,

      syncWithBackend: (items) => {
        const newTracking: Record<string, TrackedItem> = {};
        items.forEach((item) => {
          newTracking[`${item.mediaType}-${item.tmdbId}`] = item;
        });
        set((state) => ({
          trackedItems: newTracking,
          syncVersion: state.syncVersion + 1,
        }));
      },

      setTrackedItem: (item) =>
        set((state) => {
          const key = `${item.mediaType}-${item.tmdbId}`;
          return {
            trackedItems: {
              ...state.trackedItems,
              [key]: item,
            },
          };
        }),

      removeTrackedItem: (tmdbId, mediaType) =>
        set((state) => {
          const key = `${mediaType}-${tmdbId}`;
          const updated = { ...state.trackedItems };
          delete updated[key];
          return { trackedItems: updated };
        }),

      clearTracking: () => set({ trackedItems: {} }),
    }),
    {
      name: "tracking-storage",
      partialize: (state) => ({ trackedItems: state.trackedItems }),
    },
  ),
);
