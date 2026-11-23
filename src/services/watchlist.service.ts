import { api } from "@/api/api";
import type { WatchlistResponse } from "@/types/watchlist.type";
import type { NormalizedMedia } from "@/utils/media.util";

export const watchlistService = {
  getWatchlist: async (
    mediaType: "ALL" | "MOVIE" | "TV" = "ALL",
    page?: number,
    limit?: number,
  ): Promise<{ items: NormalizedMedia[]; hasMore: boolean }> => {
    const response = await api.get<WatchlistResponse>("/watchlist", {
      params: {
        ...(page !== undefined && { page }),
        ...(limit !== undefined && { limit }),
        ...(mediaType !== "ALL" && { mediaType }),
      },
    });

    const { items, page: current, totalPages } = response.data;

    return {
      items: items.map((item) => ({
        id: item.tmdbId,
        title: item.title ?? "No title",
        posterPath: item.posterPath,
        mediaType: item.mediaType,
      })),
      hasMore: current < totalPages,
    };
  },

  addItem: async (item: {
    tmdbId: number;
    mediaType: "MOVIE" | "TV" | null;
    title?: string;
    posterPath?: string | null;
  }) => {
    await api.post("/watchlist/items", {
      ...item,
      posterPath: item.posterPath ?? undefined,
    });
  },

  removeItem: async (mediaType: "MOVIE" | "TV", tmdbId: number | string) => {
    await api.delete(`/watchlist/items/${mediaType}/${tmdbId}`);
  },
};
