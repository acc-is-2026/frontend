import { isAxiosError } from "axios";
import { api } from "@/api/api";
import type {
  TrackedMediaDetails,
  TrackedMediaSummary,
} from "@/types/tracking.type";

export interface TrackMoviePayload {
  tmdbId: number;
  title?: string;
  posterPath?: string | null;
}

export const movieTrackingService = {
  getMovie: async (tmdbId: number): Promise<TrackedMediaDetails | null> => {
    try {
      const response = await api.get<TrackedMediaDetails>(
        `/tracking/movies/${tmdbId}`,
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  },

  trackMovie: async ({ tmdbId, title, posterPath }: TrackMoviePayload) => {
    const response = await api.post<TrackedMediaSummary>("/tracking/movies", {
      tmdbId,
      status: "COMPLETED",
      title,
      posterPath: posterPath ?? undefined,
    });
    return response.data;
  },

  removeMovie: async (tmdbId: number) => {
    await api.delete(`/tracking/movies/${tmdbId}`);
  },
};
