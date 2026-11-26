import { useEffect, useRef, type ReactNode } from "react";
import { Box, Center, Loader } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useFilterStore } from "@/store/useFilterStore";
import {
  useInfiniteMediaList,
  type ListMediaItem,
  type MediaPage,
} from "@/hooks/media/useInfiniteMediaList";
import ErrorAlert from "../ui/ErrorAlert";
import EmptyList from "../ui/EmptyList";

interface MediaListPageProps<T extends ListMediaItem> {
  fetchPage: (page: number) => Promise<MediaPage<T>>;
  renderItem: (item: T, remove: () => void) => ReactNode;
}

const MediaListPage = <T extends ListMediaItem>({
  fetchPage,
  renderItem,
}: MediaListPageProps<T>) => {
  const { mediaType } = useFilterStore();
  const previousMediaType = useRef(mediaType);

  const { items, loading, error, loadMoreRef, retry, removeItem } =
    useInfiniteMediaList(fetchPage);

  useEffect(() => {
    if (previousMediaType.current === mediaType) return;

    previousMediaType.current = mediaType;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mediaType]);

  return (
    <>
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "16px",
        }}
      >
        <AnimatePresence mode="popLayout">
          {items.map((media) => (
            <motion.div
              key={`${media.mediaType}-${media.id}`}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {renderItem(media, () => removeItem(media))}
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      <Box ref={loadMoreRef} mt={20} mih={100}>
        {loading && (
          <Center h={100}>
            <Loader color="primary.6" type="dots" />
          </Center>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorAlert
              title="Couldn't load the list"
              message={error}
              onRetry={retry}
            />
          </motion.div>
        )}

        {items.length === 0 && !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyList />
          </motion.div>
        )}
      </Box>
    </>
  );
};

export default MediaListPage;
