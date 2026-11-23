import { api } from "@/api/api";
import type {
  ContinueWatchingItem,
  ContinueWatchingResponse,
  UserStats,
} from "@/types/tracking.type";
import { buildContinueWatchingItems } from "@/utils/continueWatching.util";

export const userActivityService = {
  getUserTrackingLibrary: async (
    status?: "WATCHING" | "COMPLETED" | "DROPPED",
    mediaType: "ALL" | "MOVIE" | "TV" = "ALL",
    page?: number,
    limit?: number,
  ): Promise<ContinueWatchingResponse> => {
    const response = await api.get<ContinueWatchingResponse>(
      "/user-activity/tracking-library",
      {
        params: {
          ...(status !== undefined && { status }),
          ...(mediaType !== "ALL" && { mediaType }),
          ...(page !== undefined && { page }),
          ...(limit !== undefined && { limit }),
        },
      },
    );

    return response.data;
  },

  getContinueWatching: async (
    mediaType: "ALL" | "MOVIE" | "TV" = "ALL",
    page?: number,
    limit?: number,
  ): Promise<{ items: ContinueWatchingItem[]; hasMore: boolean }> => {
    const {
      items,
      page: current,
      totalPages,
    } = await userActivityService.getUserTrackingLibrary(
      "WATCHING",
      mediaType,
      page,
      limit,
    );

    return {
      items: await buildContinueWatchingItems(items),
      hasMore: current < totalPages,
    };
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await api.get<UserStats>("/user-activity/stats");
    return response.data;
  },
};
