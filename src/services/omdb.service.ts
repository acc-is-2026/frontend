import type { OmdbResponse } from "@/types/omdb.type";

const OMDB_BASE_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const omdbCache = new Map<string, OmdbResponse>();

export const omdbService = {
  getByImdbId: async (imdbId: string): Promise<OmdbResponse | null> => {
    if (!OMDB_API_KEY || !imdbId) return null;

    const cached = omdbCache.get(imdbId);
    if (cached) return cached;

    const params = new URLSearchParams({ i: imdbId, apikey: OMDB_API_KEY });
    const response = await fetch(`${OMDB_BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`OMDb error: ${response.statusText}`);
    }

    const data = (await response.json()) as OmdbResponse;
    if (data.Response === "False") return null;

    omdbCache.set(imdbId, data);
    return data;
  },
};
