import { useState, useEffect } from "react";
import { normalizeTmdbItem, type NormalizedMedia } from "@/utils/media.util";
import type { TmdbMediaItem } from "@/types/tmdb.type";

export function useMediaShelf(
  fetcher: () => Promise<{ results: TmdbMediaItem[] }>,
  defaultMediaType: "MOVIE" | "TV" = "MOVIE",
  dependencies: unknown[] = [],
) {
  const [items, setItems] = useState<NormalizedMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetcher()
      .then((data) => {
        if (!isMounted) return;

        setItems(
          (data.results || []).map((item) =>
            normalizeTmdbItem(item, defaultMediaType),
          ),
        );
      })
      .catch((err) => console.error("Shelf loading error:", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { items, isLoading };
}
