import { api } from "@/api/api";
import type { HistoryItem, WatchHistoryResponse } from "@/types/tracking.type";
import { buildHistoryItems } from "@/utils/history.util";

export const historyService = {
  getHistory: async (
    mediaType: "ALL" | "MOVIE" | "TV" = "ALL",
    page?: number,
    limit?: number,
    status?: "WATCHING" | "COMPLETED" | "DROPPED",
  ): Promise<WatchHistoryResponse> => {
    const response = await api.get<WatchHistoryResponse>("/history", {
      params: {
        ...(status !== undefined && { status }),
        ...(mediaType !== "ALL" && { mediaType }),
        ...(page !== undefined && { page }),
        ...(limit !== undefined && { limit }),
      },
    });

    return response.data;
  },

  getWatchHistory: async (
    mediaType: "ALL" | "MOVIE" | "TV" = "ALL",
    page?: number,
    limit?: number,
  ): Promise<{ items: HistoryItem[]; hasMore: boolean }> => {
    const {
      items,
      page: current,
      totalPages,
    } = await historyService.getHistory(mediaType, page, limit);

    return {
      items: await buildHistoryItems(items),
      hasMore: current < totalPages,
    };
  },

  removeItem: async (historyId: string) => {
    const response = await api.delete<{
      message: string;
      trackedMediaDeleted: boolean;
    }>(`/history/${historyId}`);

    return response.data;
  },
};
