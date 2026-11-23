import { isAxiosError } from "axios";
import { api } from "@/api/api";
import type {
  TrackedItem,
  TrackedMediaDetails,
  TrackedMediaSummary,
} from "@/types/tracking.type";
import type { EpisodeRef } from "@/utils/nextEpisode.util";

export interface TrackAllEpisodesPayload {
  tmdbId: number;
  title?: string;
  posterPath?: string | null;
  episodes: EpisodeRef[];
}

export interface TrackEpisodePayload {
  tmdbId: number;
  title?: string;
  posterPath?: string | null;
  season: number;
  episode: number;
  status: TrackedItem["status"];
}

export const showTrackingService = {
  getShow: async (tmdbId: number): Promise<TrackedMediaDetails | null> => {
    try {
      const response = await api.get<TrackedMediaDetails>(
        `/tracking/tv/${tmdbId}`,
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  },

  trackAllEpisodes: async ({
    tmdbId,
    title,
    posterPath,
    episodes,
  }: TrackAllEpisodesPayload) => {
    const response = await api.post<TrackedMediaSummary>(
      `/tracking/tv/${tmdbId}/episodes/bulk`,
      {
        status: "COMPLETED",
        title,
        posterPath: posterPath ?? undefined,
        episodes: episodes.map((e) => ({
          seasonNumber: e.season,
          episodeNumber: e.episode,
        })),
      },
    );
    return response.data;
  },

  trackEpisode: async ({
    tmdbId,
    title,
    posterPath,
    season,
    episode,
    status,
  }: TrackEpisodePayload) => {
    const response = await api.post<{ tracked: TrackedMediaSummary }>(
      `/tracking/tv/${tmdbId}/episodes`,
      {
        seasonNumber: season,
        episodeNumber: episode,
        status,
        title,
        posterPath: posterPath ?? undefined,
      },
    );
    return response.data.tracked;
  },

  untrackEpisode: async (tmdbId: number, season: number, episode: number) => {
    const response = await api.delete<{ tracked: TrackedItem | null }>(
      `/tracking/tv/${tmdbId}/episodes`,
      { data: { seasonNumber: season, episodeNumber: episode } },
    );
    return response.data.tracked;
  },

  updateStatus: async (tmdbId: number, status: TrackedItem["status"]) => {
    const response = await api.patch<TrackedMediaSummary>(
      `/tracking/tv/${tmdbId}/status`,
      { status },
    );
    return response.data;
  },

  removeShow: async (tmdbId: number) => {
    await api.delete(`/tracking/tv/${tmdbId}`);
  },
};
