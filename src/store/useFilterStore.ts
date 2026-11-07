import { create } from "zustand";

export type MediaTypeFilter = "ALL" | "MOVIE" | "TV";

interface FilterState {
  mediaType: MediaTypeFilter;
  setMediaType: (type: MediaTypeFilter) => void;
}

const getInitialMediaType = (): MediaTypeFilter => {
  if (typeof window === "undefined") return "ALL";
  const params = new URLSearchParams(window.location.search);
  const param = params.get("mediaType")?.toUpperCase();

  if (param === "MOVIE" || param === "TV") return param;
  return "ALL";
};

export const useFilterStore = create<FilterState>((set) => ({
  mediaType: getInitialMediaType(),
  setMediaType: (type) => {
    set({ mediaType: type });

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (type === "ALL") {
        url.searchParams.delete("mediaType");
      } else {
        url.searchParams.set("mediaType", type);
      }
      window.history.replaceState({}, "", url.toString());
    }
  },
}));
