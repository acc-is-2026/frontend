import { useCallback, useEffect, useRef, useState } from "react";
import { useIntersection } from "@mantine/hooks";
import type { NormalizedMedia } from "@/utils/media.util";
import { getErrorMessage } from "@/utils/getErrorMessage.util";

export interface ListMediaItem {
  id: string | number;
  mediaType: "MOVIE" | "TV";
}

export interface MediaPage<T extends ListMediaItem = NormalizedMedia> {
  items: T[];
  hasMore: boolean;
}

const dedupe = <T extends ListMediaItem>(items: T[]) =>
  Array.from(
    new Map(
      items.map((item) => [`${item.mediaType}-${item.id}`, item]),
    ).values(),
  );

export function useInfiniteMediaList<T extends ListMediaItem>(
  fetchPage: (page: number) => Promise<MediaPage<T>>,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const generation = useRef(0);
  const pageRef = useRef(0);
  const busyRef = useRef(false);
  const hasMoreRef = useRef(true);

  const { ref: loadMoreRef, entry } = useIntersection({
    root: null,
    threshold: 0.5,
  });

  const loadMore = useCallback(async () => {
    if (busyRef.current || !hasMoreRef.current) return;

    const current = generation.current;
    const nextPage = pageRef.current + 1;

    busyRef.current = true;
    setLoading(true);
    setError("");

    try {
      const result = await fetchPage(nextPage);
      if (current !== generation.current) return;

      pageRef.current = nextPage;
      hasMoreRef.current = result.hasMore;
      setHasMore(result.hasMore);
      setItems((prev) =>
        dedupe(nextPage === 1 ? result.items : [...prev, ...result.items]),
      );
    } catch (error) {
      if (current === generation.current) {
        console.error("Fetch error:", error);
        setError(
          getErrorMessage(error, "Something went wrong. Please try again."),
        );
      }
    } finally {
      if (current === generation.current) {
        busyRef.current = false;
        setLoading(false);
      }
    }
  }, [fetchPage]);

  useEffect(() => {
    generation.current += 1;
    pageRef.current = 0;
    busyRef.current = false;
    hasMoreRef.current = true;
    setItems([]);
    setHasMore(true);
    setError("");
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (entry?.isIntersecting && !error) loadMore();
  }, [entry?.isIntersecting, items.length, error, loadMore]);

  const removeItem = useCallback((item: T) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === item.id && i.mediaType === item.mediaType)),
    );
  }, []);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMoreRef,
    retry: loadMore,
    removeItem,
  };
}
